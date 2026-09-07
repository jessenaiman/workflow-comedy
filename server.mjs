import { createServer as createHttpServer } from 'node:http';
import { access, appendFile, mkdir, mkdtemp, readFile, rmdir, unlink, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { flushTracing, traceAgent, traceGeneration, traceRound, traceRoundMetadata } from './instrumentation.mjs';

export { traceRoundMetadata };

const MODEL = 'smallthinker:latest';
const OLLAMA = 'http://127.0.0.1:11434/api/chat';
const MAX_BODY = 100_000;
const MAX_TEXT = 6_000;
const REQUEST_TIMEOUT = 30_000;
const WORKFLOW_FILE = new URL('./workspace-comedians.workflow.json', import.meta.url);
const DIAGRAM_FILE = new URL('./workspace-comedians.workflow.html', import.meta.url);
const workflow = JSON.parse(await readFile(WORKFLOW_FILE, 'utf8'));
const WORKFLOW_EDGES = new Set(workflow.edges.map(({ from, to }) => `${from}>${to}`));
const TURN_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['status', 'action', 'evidence', 'failedField', 'correction', 'reaction'],
  properties: {
    status: { type: 'string', enum: ['DONE', 'WRONG', 'BLOCKED'] },
    action: { type: 'string' }, evidence: { type: 'string' }, failedField: { type: 'string' },
    correction: { type: 'string' }, reaction: { type: 'string' },
  },
};

const roleName = {
  'big-brain-contract': 'Big Brain', 'abbott-attempt': 'Abbott', 'big-brain-review': 'Big Brain',
  'costello-correction': 'Costello', 'abbott-retry': 'Abbott', 'costello-recheck': 'Costello',
  'big-brain-decision': 'Big Brain',
};
const nodeForStage = {
  'big-brain-contract': 'big-brain', 'abbott-attempt': 'abbott', 'big-brain-review': 'evidence',
  'costello-correction': 'costello', 'abbott-retry': 'abbott-retry', 'costello-recheck': 'costello-recheck',
  'big-brain-decision': 'manager-decision',
};

function fail(message, status = 400) { const error = new Error(message); error.status = status; return error; }
function text(value, field, required = true) {
  if (typeof value !== 'string' || (required && !value.trim()) || value.length > MAX_TEXT) throw fail(`Invalid ${field}`);
  return value.trim();
}
function cleanInput(input) {
  if (!input || typeof input !== 'object') throw fail('JSON object required');
  return {
    caseId: text(input.caseId, 'caseId'), roundId: text(input.roundId, 'roundId'),
    roundNumber: Number.isInteger(input.roundNumber) && input.roundNumber > 0 ? input.roundNumber : 1,
    hypothetical: text(input.hypothetical, 'hypothetical'), acceptance: text(input.acceptance, 'acceptance'),
    hiddenRegression: text(input.hiddenRegression || '', 'hiddenRegression', false),
    unresolvedEvidence: text(input.unresolvedEvidence || '', 'unresolvedEvidence', false),
  };
}

export function comparePath(path, allowedEdges) {
  const violations = [];
  for (let index = 1; index < path.length; index += 1) {
    const from = path[index - 1]; const to = path[index];
    if (!allowedEdges.has(`${from}>${to}`)) violations.push({ from, to });
  }
  return { ok: violations.length === 0, violations };
}

export function validateFollowUp(value) {
  if (!value || typeof value !== 'object') throw fail('Follow-up object required');
  const previousRoundId = text(value.previousRoundId, 'previousRoundId');
  const unresolvedEvidence = text(value.unresolvedEvidence || '', 'new failure evidence');
  return { previousRoundId, unresolvedEvidence };
}

function turn(content, role) {
  let result = content;
  if (typeof result === 'string') { try { result = JSON.parse(result); } catch { throw fail('Model returned non-JSON turn'); } }
  if (!result || typeof result !== 'object' || !['DONE', 'WRONG', 'BLOCKED'].includes(result.status)) throw fail('Invalid model status');
  const parsed = {
    status: result.status, action: text(result.action, 'model action'), evidence: text(result.evidence, 'model evidence'),
    failedField: text(result.failedField || '', 'model failedField', result.status !== 'DONE'),
    correction: text(result.correction || '', 'model correction', result.status !== 'DONE'),
    reaction: role.startsWith('costello-') ? text(result.reaction || '', 'model reaction', false) : '',
  };
  return { role: roleName[role], stage: role, nodeId: nodeForStage[role], ...parsed };
}

function modelInput(role, input) {
  const task = { hypothetical: input.hypothetical, acceptance: input.acceptance };
  if (!['big-brain-contract', 'abbott-attempt'].includes(role)) task.hiddenRegression = input.hiddenRegression;
  if (input.unresolvedEvidence) task.unresolvedEvidence = input.unresolvedEvidence;
  return task;
}

export function codexArgs(directory, schema, output) {
  return [
    'exec', '--ephemeral', '--ignore-user-config', '--ignore-rules', '-s', 'read-only',
    '--skip-git-repo-check', '-C', directory, '--model', 'gpt-5.6-luna',
    '--config', 'model_reasoning_effort="low"', '--output-schema', schema,
    '--output-last-message', output, '-',
  ];
}

async function removeFile(file) {
  try { await unlink(file); } catch (error) { if (error.code !== 'ENOENT') throw error; }
}

async function codexChat({ role, input, prior, signal }) {
  const messages = prompt(role, input, prior);
  return traceGeneration({ name: 'generate-codex-turn', model: 'gpt-5.6-luna', input: messages, metadata: { provider: 'codex', role }, validate: (result) => turn(result.content, role) }, async () => {
    const directory = await mkdtemp(join(tmpdir(), 'workspace-comedians-'));
    const schema = join(directory, 'TURN_SCHEMA.json'); const output = join(directory, 'TURN_OUTPUT.json');
    await writeFile(schema, JSON.stringify(TURN_SCHEMA));
    try {
      await new Promise((resolve, reject) => {
        const child = spawn('codex', codexArgs(directory, schema, output), { stdio: ['pipe', 'ignore', 'pipe'] });
        let stderr = ''; child.stderr.on('data', (chunk) => { stderr += chunk; });
        child.once('error', reject); child.once('close', (code) => code === 0 ? resolve() : reject(new Error(stderr.trim() || `Codex exited ${code}`)));
        child.stdin.end(JSON.stringify(messages));
        const timeout = AbortSignal.timeout(60_000);
        const abort = signal ? AbortSignal.any([signal, timeout]) : timeout;
        abort.addEventListener('abort', () => child.kill(), { once: true });
      });
      return { content: await readFile(output, 'utf8'), provider: 'codex', metrics: { fallback: true } };
    } finally {
      await removeFile(schema); await removeFile(output); await rmdir(directory);
    }
  });
}

export async function hybridChat({ primary = ollamaChat, fallback = codexChat, ...args }) {
  try { const result = await primary(args); turn(result?.content, args.role); return { ...result, provider: result?.provider || 'ollama', fallbackReason: null }; }
  catch (error) {
    try { const result = await fallback(args); turn(result?.content, args.role); return { ...result, provider: result?.provider || 'codex', fallbackReason: error.message.includes('Invalid model') || error.message.includes('non-JSON') ? 'validation' : 'transport' }; }
    catch (fallbackError) { throw new Error(`${error.message}; fallback: ${fallbackError.message}`); }
  }
}
function prompt(role, input, prior) {
  const actors = {
    'big-brain-contract': 'workflow manager',
    'abbott-attempt': 'implementation analyst',
    'big-brain-review': 'evidence reviewer',
    'costello-correction': 'correction reviewer',
    'abbott-retry': 'implementation analyst',
    'costello-recheck': 'verification reviewer',
    'big-brain-decision': 'workflow manager',
  };
  const jobs = {
    'big-brain-contract': 'Define the observable contract and stop condition. Do not propose the fix.',
    'abbott-attempt': 'Make one serious, competent fix proposal. Do not copy the prior turn, joke, or speculate about hidden constraints.',
    'big-brain-review': 'Compare the proposal to every supplied acceptance and regression constraint. Missing proof or an unhandled constraint is WRONG.',
    'costello-correction': 'Name one failed field, give the smallest correction, then one original dry reaction of at most twelve words.',
    'abbott-retry': 'Apply only the correction to produce a revised fix proposal and fresh evidence. Do not repeat the prior wording.',
    'costello-recheck': 'Check the corrected field once. Give one short dry reaction only after the evidence.',
    'big-brain-decision': 'Compress the final assessment; do not close the case or repeat the previous turn.',
  };
  return [
    { role: 'system', content: `You are the ${actors[role]}. ${jobs[role]} Return only JSON matching the supplied schema. Action is at most two short sentences; evidence is one short sentence. Leave reaction empty unless your job explicitly requires it. Do not copy prior wording. You cannot read files, execute commands, call tools, or claim live verification. Set DONE only when the supplied facts support it. A human, never you, closes the case.` },
    { role: 'user', content: JSON.stringify({ task: modelInput(role, input), prior: prior.slice(-1) }) },
  ];
}

export async function ollamaChat({ role, input, prior, signal }) {
  const messages = prompt(role, input, prior);
  return traceGeneration({ name: 'generate-ollama-turn', model: MODEL, input: messages, metadata: { provider: 'ollama', role }, validate: (result) => turn(result.content, role) }, async () => {
    const response = await fetch(OLLAMA, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(REQUEST_TIMEOUT)]) : AbortSignal.timeout(REQUEST_TIMEOUT),
      body: JSON.stringify({ model: MODEL, stream: false, format: TURN_SCHEMA, messages, options: { num_ctx: 2048, num_predict: 180, temperature: role.startsWith('costello-') ? 0.75 : 0.25 } }),
    });
    if (!response.ok) throw fail(`Ollama request failed: ${response.status}`, 502);
    const json = await response.json();
    return { content: json.message?.content, metrics: { promptEvalCount: json.prompt_eval_count, evalCount: json.eval_count } };
  });
}

export async function runRound(rawInput, { chat = ollamaChat, emit = () => {}, signal } = {}) {
  const input = cleanInput(rawInput);
  return traceRound(input, async () => {
  const turns = []; const path = ['task-contract']; const violations = [];
  const call = async (stage, node, adjust = (value) => value) => {
    try {
      const task = modelInput(stage, input); const prior = turns.slice(-1);
      return await traceAgent(stage, { task, prior }, async () => {
        const reply = await chat({ role: stage, input: task, prior, signal });
        const next = adjust({ ...turn(reply?.content, stage), provider: reply?.provider || 'ollama', fallbackReason: reply?.fallbackReason || null, metrics: reply?.metrics || {} }); turns.push(next); path.push(node); emit({ type: 'turn', roundId: input.roundId, turn: next }); return next;
      });
    } catch (error) {
      violations.push({ code: 'invalid-turn', stage, message: error.message });
      emit({ type: 'blocked', roundId: input.roundId, stage, message: error.message });
      return null;
    }
  };
  const finish = (status) => {
    const diagramPath = [...path, 'human-resolution'];
    const deviation = comparePath(diagramPath, WORKFLOW_EDGES);
    if (!deviation.ok) violations.push(...deviation.violations.map((item) => ({ code: 'diagram-deviation', ...item })));
    return { ...input, status, turns, path: diagramPath, violations };
  };
  const contract = await call('big-brain-contract', 'big-brain');
  const attempt = contract && await call('abbott-attempt', 'abbott');
  const review = attempt && await call('big-brain-review', 'evidence', (result) => input.hiddenRegression && result.status === 'DONE' ? {
    ...result,
    status: 'WRONG',
    failedField: 'PROOF',
    evidence: `Director-only regression not addressed: ${input.hiddenRegression}`,
    correction: 'Revise the proposal to handle this regression and preserve the acceptance check.',
  } : result);
  if (!review) return finish('blocked');
  if (review.status === 'DONE') return finish('candidate-done');
  const correction = await call('costello-correction', 'costello');
  if (correction) path.push('correction-packet');
  const retry = correction && await call('abbott-retry', 'abbott-retry');
  if (retry) path.push('retry-evidence');
  const recheck = retry && await call('costello-recheck', 'costello-recheck');
  const decision = recheck && await call('big-brain-decision', 'manager-decision');
  const status = decision?.status === 'DONE' ? 'candidate-done' : decision ? 'candidate-unresolved' : 'blocked';
  return finish(status);
  });
}

export class JsonlStore {
  constructor(file) { this.file = file instanceof URL ? fileURLToPath(file) : file; this.pending = Promise.resolve(); }
  append(record) {
    if (!record || typeof record !== 'object' || !record.type || !record.id) throw fail('Record type and id required');
    const line = `${JSON.stringify({ ...record, at: record.at || new Date().toISOString() })}\n`;
    this.pending = this.pending.then(async () => { await mkdir(dirname(this.file), { recursive: true }); await appendFile(this.file, line, 'utf8'); });
    return this.pending;
  }
  async records() {
    await this.pending;
    try { return (await readFile(this.file, 'utf8')).split('\n').filter(Boolean).map((line) => JSON.parse(line)); }
    catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  }
  async cases() {
    const cases = new Map(); const rounds = new Map();
    for (const record of await this.records()) {
      if (record.type === 'case') cases.set(record.id, { ...record, rounds: [] });
      if (record.type === 'round') rounds.set(record.id, { ...record, verdict: null });
      if (record.type === 'verdict' && rounds.has(record.roundId)) rounds.get(record.roundId).verdict = record;
    }
    for (const round of rounds.values()) cases.get(round.caseId)?.rounds.push(round);
    return [...cases.values()].map((item) => ({ ...item, rounds: item.rounds.sort((a, b) => a.roundNumber - b.roundNumber) }));
  }
}

async function body(request) {
  let size = 0; const chunks = [];
  for await (const chunk of request) { size += chunk.length; if (size > MAX_BODY) throw fail('Request body too large', 413); chunks.push(chunk); }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch { throw fail('Invalid JSON'); }
}
function send(response, status, value) { response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' }); response.end(JSON.stringify(value)); }
function route(url, method) { return `${method} ${url.pathname}`; }
async function asset(response, file, type) {
  try { response.writeHead(200, { 'content-type': type }); response.end(await readFile(file)); return true; }
  catch (error) { if (error.code === 'ENOENT') return false; throw error; }
}
function score(value, field) { if (!Number.isInteger(value) || value < 1 || value > 5) throw fail(`${field} must be an integer from 1 to 5`); return value; }

function codexAvailable() {
  return new Promise((resolve) => {
    const child = spawn('codex', ['login', 'status'], { stdio: 'ignore' });
    const timeout = setTimeout(() => child.kill(), 3_000);
    child.once('error', () => { clearTimeout(timeout); resolve(false); });
    child.once('close', (code) => { clearTimeout(timeout); resolve(code === 0); });
  });
}

export function createServer({ store = new JsonlStore(new URL('./workspace-comedians.runs.jsonl', import.meta.url)), chat = hybridChat, healthProbe = null, fallbackProbe = codexAvailable, diagramProbe = () => access(DIAGRAM_FILE) } = {}) {
  let active = false;
  return createHttpServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://127.0.0.1'); const key = route(url, request.method);
      if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
        if (await asset(response, new URL('./index.html', import.meta.url), 'text/html; charset=utf-8')) return;
      }
      if (request.method === 'GET' && url.pathname === '/workspace-comedians.workflow.html') {
        if (await asset(response, DIAGRAM_FILE, 'text/html; charset=utf-8')) return;
      }
      if (key === 'GET /api/health') {
        const probe = healthProbe || (async () => {
          const response = await fetch('http://127.0.0.1:11434/api/tags', { signal: AbortSignal.timeout(3_000) });
          if (!response.ok) throw fail(`Ollama probe failed: ${response.status}`); return true;
        });
        const [ollama, codex, diagram] = await Promise.all([
          probe().then(() => true, () => false), fallbackProbe().then(Boolean, () => false), diagramProbe().then(() => true, () => false),
        ]);
        const ok = diagram && (ollama || codex);
        return send(response, ok ? 200 : 503, { ok, model: MODEL, fallbackModel: 'gpt-5.6-luna', active, ollama, codex, diagram });
      }
      if (key === 'GET /api/cases') return send(response, 200, await store.cases());
      const startRound = async (item, value) => {
        if (active) throw fail('A round is already running', 409);
        const followUp = value.previousRoundId ? validateFollowUp(value) : null;
        if (followUp && !item.rounds.some((round) => round.id === followUp.previousRoundId)) throw fail('Previous round is not in this case', 400);
        const input = { ...item, ...followUp, caseId: item.id, roundId: randomUUID(), roundNumber: item.rounds.length + 1, unresolvedEvidence: followUp?.unresolvedEvidence || '' };
        active = true; response.writeHead(200, { 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-cache' });
        const abort = new AbortController(); request.once('aborted', () => abort.abort());
        const emit = (event) => { if (!response.writableEnded) response.write(`${JSON.stringify(event)}\n`); };
        emit({ type: 'started', caseId: input.caseId, roundId: input.roundId });
        try { const result = await runRound(input, { chat, emit, signal: abort.signal }); await store.append({ type: 'round', id: input.roundId, caseId: input.caseId, roundNumber: input.roundNumber, ...result }); emit({ type: 'complete', round: result }); }
        finally { await flushTracing(); active = false; if (!response.writableEnded) response.end(); }
      };
      if (key === 'POST /api/cases') {
        const value = await body(request); const record = { type: 'case', id: randomUUID(), hypothetical: text(value.hypothetical, 'hypothetical'), acceptance: text(value.acceptance, 'acceptance'), hiddenRegression: text(value.hiddenRegression || '', 'hiddenRegression', false) };
        await store.append(record); return startRound({ ...record, rounds: [] }, value);
      }
      const roundMatch = url.pathname.match(/^\/api\/cases\/([^/]+)\/rounds$/);
      if (request.method === 'POST' && roundMatch) {
        const cases = await store.cases(); const item = cases.find((candidate) => candidate.id === decodeURIComponent(roundMatch[1])); if (!item) throw fail('Case not found', 404);
        return startRound(item, await body(request));
      }
      const verdictMatch = url.pathname.match(/^\/api\/rounds\/([^/]+)\/verdicts$/);
      if (request.method === 'POST' && verdictMatch) {
        const value = await body(request); if (typeof value.resolved !== 'boolean') throw fail('resolved must be boolean');
        const rounds = (await store.cases()).flatMap((item) => item.rounds); const roundId = decodeURIComponent(verdictMatch[1]); if (!rounds.some((round) => round.id === roundId)) throw fail('Round not found', 404);
        if (!['pass', 'unclear', 'fail'].includes(value.correctness)) throw fail('correctness must be pass, unclear, or fail');
        const record = { type: 'verdict', id: randomUUID(), roundId, resolved: value.resolved, correctness: value.correctness, funny: score(value.funny, 'funny'), originality: score(value.originality, 'originality'), note: text(value.note || '', 'note', false), unresolvedEvidence: value.resolved ? '' : text(value.unresolvedEvidence || '', 'unresolvedEvidence'), actor: 'human' };
        await store.append(record); return send(response, 201, record);
      }
      send(response, 404, { error: 'Not found' });
    } catch (error) { send(response, error.status || 500, { error: error.message || 'Internal server error' }); }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) createServer().listen(4173, '127.0.0.1');
