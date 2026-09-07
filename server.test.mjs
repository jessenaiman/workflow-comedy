import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  createServer,
  JsonlStore,
  comparePath,
  ollamaChat,
  hybridChat,
  runRound,
  validateFollowUp,
} from './server.mjs';

test('round tracing groups retries into one case session', async () => {
  const { traceRoundMetadata } = await import('./server.mjs');
  assert.deepEqual(traceRoundMetadata?.({
    caseId: 'case-42',
    roundId: 'round-7',
    roundNumber: 2,
    hypothetical: 'Fix the race',
    acceptance: 'Only one winner',
  }), {
    traceName: 'run-duo-round',
    sessionId: 'case-42',
    tags: ['duo'],
    metadata: { roundId: 'round-7', roundNumber: '2' },
    input: { hypothetical: 'Fix the race', acceptance: 'Only one winner' },
  });
});

test('hybridChat uses primary when valid and fallback only on failure', async () => {
  const calls = [];
  const fallback = async (args) => { calls.push('fallback'); return { content: JSON.stringify(reply('DONE')), metrics: { source: 'codex' } }; };
  const primary = async () => { calls.push('primary'); return { content: JSON.stringify(reply('DONE')), metrics: { source: 'ollama' } }; };
  const result = await hybridChat({ role: 'big-brain-contract', input, prior: [], primary, fallback });
  assert.deepEqual(calls, ['primary']);
  assert.equal(result.provider, 'ollama');
  const failed = await hybridChat({ role: 'big-brain-contract', input, prior: [], primary: async () => { throw new Error('timeout'); }, fallback });
  assert.equal(failed.provider, 'codex');
  assert.deepEqual(calls, ['primary', 'fallback']);
});

test('Codex fallback pins Luna low in an ephemeral read-only run', async () => {
  const { codexArgs } = await import('./server.mjs');
  const args = codexArgs('C:\\temp\\empty', 'C:\\temp\\schema.json', 'C:\\temp\\output.json');

  assert.equal(args.includes('gpt-5.6-luna'), true);
  assert.equal(args.includes('model_reasoning_effort="low"'), true);
  assert.equal(args.includes('--ephemeral'), true);
  assert.equal(args.includes('read-only'), true);
  assert.equal(args.includes('C:\\temp\\empty'), true);
});

test('runRound records fallback provider and reason', async () => {
  const primary = async () => ({ content: '{bad' });
  const fallback = async () => ({ content: JSON.stringify(reply('DONE')), metrics: { source: 'codex' } });
  const round = await runRound(input, { chat: (args) => hybridChat({ ...args, primary, fallback }) });
  assert.equal(round.turns[0].provider, 'codex');
  assert.equal(round.turns[0].fallbackReason, 'validation');
});

async function httpServer(options) {
  const server = createServer(options);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

const reply = (status, overrides = {}) => ({
  status,
  action: 'Inspect the reported behavior.',
  evidence: 'The supplied acceptance check is the observable boundary.',
  failedField: status === 'DONE' ? '' : 'PROOF',
  correction: status === 'DONE' ? '' : 'Address the missing proof.',
  reaction: '',
  ...overrides,
});

function fakeChat(replies) {
  const calls = [];
  return {
    calls,
    chat: async ({ role }) => {
      calls.push(role);
      const content = replies.shift();
      if (!content) throw new Error(`Unexpected model call for ${role}`);
      return { content, metrics: { promptEvalCount: 10, evalCount: 20 } };
    },
  };
}

const input = {
  caseId: 'case-1',
  roundId: 'round-1',
  roundNumber: 1,
  hypothetical: 'Retry remains disabled after a request fails.',
  acceptance: 'Retry becomes enabled and sends only one new request.',
  hiddenRegression: 'The first request may finish late.',
  unresolvedEvidence: '',
};

test('DONE reaches the human gate without activating Costello', async () => {
  const model = fakeChat([reply('DONE'), reply('DONE'), reply('DONE')]);
  const events = [];

  const round = await runRound({ ...input, hiddenRegression: '' }, { chat: model.chat, emit: events.push.bind(events) });

  assert.deepEqual(model.calls, ['big-brain-contract', 'abbott-attempt', 'big-brain-review']);
  assert.equal(round.status, 'candidate-done');
  assert.deepEqual(round.path, ['task-contract', 'big-brain', 'abbott', 'evidence', 'human-resolution']);
  assert.deepEqual(round.violations, []);
  assert.equal(round.turns.some((turn) => turn.role === 'Costello'), false);
  assert.deepEqual(round.turns[0].metrics, { promptEvalCount: 10, evalCount: 20 });
});

test('director-only regression forces the one correction loop before human resolution', async () => {
  const model = fakeChat([
    reply('DONE'), reply('DONE'), reply('DONE'), reply('WRONG', { reaction: 'The first request has returned from the dead.' }),
    reply('DONE'), reply('DONE'), reply('DONE'),
  ]);

  const round = await runRound(input, { chat: model.chat });

  assert.equal(round.turns.find((turn) => turn.stage === 'big-brain-review').status, 'WRONG');
  assert.match(round.turns.find((turn) => turn.stage === 'big-brain-review').evidence, /first request may finish late/i);
  assert.equal(model.calls.includes('costello-correction'), true);
  assert.equal(round.path.at(-1), 'human-resolution');
});

test('WRONG permits exactly one correction, retry, recheck, and decision', async () => {
  const model = fakeChat([
    reply('DONE'),
    reply('DONE'),
    reply('WRONG'),
    reply('WRONG', { reaction: 'Tiny race. Large paperwork.' }),
    reply('DONE'),
    reply('DONE'),
    reply('DONE'),
  ]);

  const round = await runRound(input, { chat: model.chat });

  assert.deepEqual(model.calls, [
    'big-brain-contract',
    'abbott-attempt',
    'big-brain-review',
    'costello-correction',
    'abbott-retry',
    'costello-recheck',
    'big-brain-decision',
  ]);
  assert.equal(round.turns.filter((turn) => turn.role === 'Abbott').length, 2);
  assert.equal(round.turns.filter((turn) => turn.role === 'Costello').length, 2);
  assert.deepEqual(round.path, [
    'task-contract', 'big-brain', 'abbott', 'evidence', 'costello', 'correction-packet',
    'abbott-retry', 'retry-evidence', 'costello-recheck', 'manager-decision', 'human-resolution',
  ]);
  assert.deepEqual(round.violations, []);
});

test('Abbott request excludes hidden evidence and comedy framing', { concurrency: false }, async () => {
  const originalFetch = globalThis.fetch;
  let sent;
  globalThis.fetch = async (_url, init) => {
    sent = JSON.parse(init.body);
    return { ok: true, json: async () => ({ message: { content: JSON.stringify(reply('DONE')) }, prompt_eval_count: 1, eval_count: 2 }) };
  };
  try {
    await ollamaChat({ role: 'abbott-attempt', input: { ...input, unresolvedEvidence: 'The retry still loses a late race.' }, prior: [] });
  } finally {
    globalThis.fetch = originalFetch;
  }

  const payload = JSON.stringify(sent.messages);
  assert.equal(payload.includes(input.hiddenRegression), false);
  assert.equal(payload.includes('The retry still loses a late race.'), true);
  assert.doesNotMatch(payload, /comedy|Abbott|Costello/i);
});

test('contract turn cannot disclose the director-only regression', { concurrency: false }, async () => {
  const originalFetch = globalThis.fetch;
  let sent;
  globalThis.fetch = async (_url, init) => {
    sent = JSON.parse(init.body);
    return { ok: true, json: async () => ({ message: { content: JSON.stringify(reply('DONE')) } }) };
  };
  try {
    await ollamaChat({ role: 'big-brain-contract', input, prior: [] });
  } finally {
    globalThis.fetch = originalFetch;
  }
  assert.equal(JSON.stringify(sent.messages).includes(input.hiddenRegression), false);
});

test('malformed model output fails closed as a visible blocked round', async () => {
  const model = fakeChat([reply('DONE'), { status: 'DONE', action: '', evidence: '' }]);

  const round = await runRound(input, { chat: model.chat });

  assert.equal(round.status, 'blocked');
  assert.equal(round.violations[0].code, 'invalid-turn');
  assert.equal(round.path.at(-1), 'human-resolution');
});

test('a follow-up round requires new evidence', () => {
  assert.throws(
    () => validateFollowUp({ previousRoundId: 'round-1', unresolvedEvidence: '   ' }),
    /new failure evidence/i,
  );
  assert.deepEqual(
    validateFollowUp({ previousRoundId: 'round-1', unresolvedEvidence: 'Late response overwrote the retry.' }),
    { previousRoundId: 'round-1', unresolvedEvidence: 'Late response overwrote the retry.' },
  );
});

test('path comparison reports transitions missing from the authored diagram', () => {
  const result = comparePath(
    ['task-contract', 'big-brain', 'abbott', 'human-resolution'],
    new Set(['task-contract>big-brain', 'big-brain>abbott']),
  );

  assert.equal(result.ok, false);
  assert.deepEqual(result.violations, [{ from: 'abbott', to: 'human-resolution' }]);
});

test('append-only records reconstruct cases, rounds, and the latest verdict', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'duo-console-'));
  const file = path.join(directory, 'runs.jsonl');
  const store = new JsonlStore(file);

  await store.append({ type: 'case', id: 'case-1', hypothetical: 'Bug', acceptance: 'Fixed' });
  await store.append({ type: 'round', id: 'round-1', caseId: 'case-1', roundNumber: 1 });
  await store.append({ type: 'verdict', id: 'verdict-1', roundId: 'round-1', resolved: false });
  await store.append({ type: 'verdict', id: 'verdict-2', roundId: 'round-1', resolved: true });

  const cases = await store.cases();
  const raw = await readFile(file, 'utf8');

  assert.equal(raw.trim().split('\n').length, 4);
  assert.equal(cases[0].rounds[0].verdict.id, 'verdict-2');
});

test('HTTP creates and streams an initial round, then returns a UI-ready flattened round', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'duo-http-'));
  const model = fakeChat([reply('DONE'), reply('DONE'), reply('DONE')]);
  const app = await httpServer({ store: new JsonlStore(path.join(directory, 'runs.jsonl')), chat: model.chat });
  try {
    const created = await fetch(`${app.url}/api/cases`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ hypothetical: 'Bug', acceptance: 'Fixed' }),
    });
    assert.equal(created.headers.get('content-type')?.startsWith('application/x-ndjson'), true);
    const events = (await created.text()).trim().split('\n').map(JSON.parse);
    assert.equal(events.at(-1).type, 'complete');
    assert.equal(events[0].caseId, events.at(-1).round.caseId);
    assert.equal(events.some((event) => event.type === 'turn' && event.turn.nodeId === 'abbott'), true);

    const cases = await (await fetch(`${app.url}/api/cases`)).json();
    assert.equal(cases[0].rounds[0].status, 'candidate-done');
    assert.equal(Array.isArray(cases[0].rounds[0].turns), true);
    assert.equal(Array.isArray(cases[0].rounds[0].path), true);
  } finally { await app.close(); }
});

test('HTTP health remains ready when Ollama is down and Codex fallback is available', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'duo-health-'));
  const app = await httpServer({
    store: new JsonlStore(path.join(directory, 'runs.jsonl')),
    healthProbe: async () => { throw new Error('offline'); },
    fallbackProbe: async () => true,
    diagramProbe: async () => true,
  });
  try {
    const response = await fetch(`${app.url}/api/health`);
    const health = await response.json();
    assert.equal(response.status, 200);
    assert.deepEqual({ ok: health.ok, ollama: health.ollama, codex: health.codex }, { ok: true, ollama: false, codex: true });
    assert.equal(health.fallbackModel, 'gpt-5.6-luna');
  } finally { await app.close(); }
});

test('HTTP serves only the approved fixed local assets', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'duo-assets-'));
  const app = await httpServer({ store: new JsonlStore(path.join(directory, 'runs.jsonl')) });
  try {
    for (const pathname of ['/', '/index.html', '/workspace-comedians.workflow.html']) {
      const response = await fetch(`${app.url}${pathname}`);
      assert.equal(response.status, 200, pathname);
    }
    assert.equal((await fetch(`${app.url}/server.mjs`)).status, 404);
  } finally { await app.close(); }
});

test('HTTP verdict retains human scoring and evidence for an unresolved result', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'duo-verdict-'));
  const store = new JsonlStore(path.join(directory, 'runs.jsonl'));
  await store.append({ type: 'case', id: 'case-1', hypothetical: 'Bug', acceptance: 'Fixed' });
  await store.append({ type: 'round', id: 'round-1', caseId: 'case-1', roundNumber: 1, status: 'candidate-unresolved' });
  const app = await httpServer({ store });
  try {
    const response = await fetch(`${app.url}/api/rounds/round-1/verdicts`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ resolved: false, correctness: 'unclear', funny: 3, originality: 4, unresolvedEvidence: 'Late response', note: 'Need proof' }),
    });
    const verdict = await response.json();
    assert.equal(response.status, 201);
    assert.deepEqual({ resolved: verdict.resolved, correctness: verdict.correctness, funny: verdict.funny, originality: verdict.originality, unresolvedEvidence: verdict.unresolvedEvidence }, { resolved: false, correctness: 'unclear', funny: 3, originality: 4, unresolvedEvidence: 'Late response' });
  } finally { await app.close(); }
});
