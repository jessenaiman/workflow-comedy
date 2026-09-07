import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const segmentPaths = [
  'workflow.md',
  'workflow/overall-process.md',
  'workflow/agent-handoffs.md',
  'workflow/a2a-communication.md',
  'hypotheticals/01-homepage-theme-colors.md',
  'hypotheticals/02-cookie-consent-config.md',
  'hypotheticals/03-unauthorized-toolkit-install.md',
  'hypotheticals/04-signup-form-backend.md',
  'hypotheticals/05-load-bearing-dead-code.md',
  'personas/README.md',
  'personas/yeah-boss.md',
  'personas/okayest-regional-manager.md',
  'personas/camera-glance-developer.md',
  'personas/basement-stapler-engineer.md',
  'personas/restart-desk-technician.md',
  'personas/assistant-to-the-auditor.md',
  'personas/first-base-reviewer.md',
  'personas/theme-receptionist.md',
  'personas/severe-accountant.md',
  'personas/deadline-showrunner.md',
];

const outputFlag = process.argv.indexOf('--output');
const output = resolve(root, outputFlag === -1 ? 'workflow-studio.html' : process.argv[outputFlag + 1]);
const segments = segmentPaths.map((path) => ({
  path,
  label: path.split('/').at(-1).replace(/\.md$/, '').replaceAll('-', ' '),
  content: readFileSync(resolve(root, path), 'utf8'),
}));
const archifyHtml = readFileSync(resolve(root, 'diagrams/overall-workflow.html'), 'utf8');
const json = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Workflow Comedy Studio</title>
<style>
:root{color-scheme:dark;--bg:#07101f;--panel:#0d1728;--line:#26344c;--text:#ecf2ff;--muted:#95a5bf;--cyan:#20c7df;--violet:#9b7cff}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace}button,.action{font:inherit;color:inherit;background:#152238;border:1px solid var(--line);border-radius:8px;padding:8px 12px;cursor:pointer;text-decoration:none}button:hover,.action:hover,button[aria-selected=true]{border-color:var(--cyan);color:#fff}.shell{height:100vh;display:grid;grid-template-rows:auto 1fr}.top{display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid var(--line);background:#091426}.top h1{font-size:17px;margin:0 auto 0 0}.tab{min-width:110px}.panel{min-height:0}.hidden{display:none!important}#diagramPanel{padding:10px}iframe{width:100%;height:100%;border:1px solid var(--line);border-radius:12px;background:white}#markdownPanel{display:grid;grid-template-columns:280px 1fr;min-height:0}.segments{overflow:auto;border-right:1px solid var(--line);padding:12px;background:#091426}.segments button{width:100%;text-align:left;margin-bottom:7px;white-space:normal}.segments small{display:block;color:var(--muted)}.editor{min-width:0;display:grid;grid-template-rows:auto 1fr;padding:14px;gap:10px}.editor-head{display:flex;align-items:center;gap:8px}.editor-head strong{margin-right:auto}.path{color:var(--muted);font-size:12px}textarea{width:100%;height:100%;resize:none;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--text);padding:18px;font:14px/1.55 ui-monospace,SFMono-Regular,Consolas,monospace;outline:none}textarea:focus{border-color:var(--violet)}#status{color:var(--muted);min-width:80px;text-align:right}@media(max-width:760px){#markdownPanel{grid-template-columns:1fr;grid-template-rows:180px 1fr}.segments{border-right:0;border-bottom:1px solid var(--line)}.top h1{display:none}.editor-head{flex-wrap:wrap}}
</style>
</head>
<body data-segment-count="${segments.length}">
<div class="shell">
  <header class="top">
    <h1>Workflow Comedy Studio</h1>
    <button class="tab" id="diagramTab" aria-selected="true">Diagram</button>
    <button class="tab" id="markdownTab" aria-selected="false">Markdown</button>
    <span id="status" role="status"></span>
  </header>
  <section id="diagramPanel" class="panel"><iframe id="diagramFrame" title="Archify workflow"></iframe></section>
  <section id="markdownPanel" class="panel hidden">
    <nav class="segments" id="segments" aria-label="Markdown segments"></nav>
    <main class="editor">
      <div class="editor-head">
        <div><strong id="segmentTitle"></strong><div class="path" id="segmentPath"></div></div>
        <button id="copy">Select text</button>
        <a class="action" id="download" download>Download .md</a>
        <button id="reset">Reset</button>
      </div>
      <textarea id="source" spellcheck="false" aria-label="Editable Markdown source"></textarea>
    </main>
  </section>
</div>
<script>
const segments=${json(segments)};
const archifyHtml=${json(archifyHtml)};
const drafts=new Map();
let current=null;
const byId=(id)=>document.getElementById(id);
const source=byId('source');
const status=(message)=>{byId('status').textContent=message;setTimeout(()=>{if(byId('status').textContent===message)byId('status').textContent=''},1800)};
byId('diagramFrame').srcdoc=archifyHtml;

function select(index){
  if(current!==null)drafts.set(segments[current].path,source.value);
  current=index;
  const segment=segments[index];
  source.value=drafts.has(segment.path)?drafts.get(segment.path):segment.content;
  byId('segmentTitle').textContent=segment.label;
  byId('segmentPath').textContent=segment.path;
  updateDownload();
  document.querySelectorAll('[data-segment-path]').forEach((button)=>button.setAttribute('aria-selected',String(button.dataset.segmentPath===segment.path)));
}

function updateDownload(){
  byId('download').href='data:text/markdown;charset=utf-8,'+encodeURIComponent(source.value);
  byId('download').download=segments[current].path.split('/').at(-1);
}

for(const [index,segment] of segments.entries()){
  const button=document.createElement('button');
  button.dataset.segmentPath=segment.path;
  button.innerHTML='<strong>'+segment.label+'</strong><small>'+segment.path+'</small>';
  button.addEventListener('click',()=>select(index));
  byId('segments').append(button);
}

function show(panel){
  const diagram=panel==='diagram';
  byId('diagramPanel').classList.toggle('hidden',!diagram);
  byId('markdownPanel').classList.toggle('hidden',diagram);
  byId('diagramTab').setAttribute('aria-selected',String(diagram));
  byId('markdownTab').setAttribute('aria-selected',String(!diagram));
}

byId('diagramTab').addEventListener('click',()=>show('diagram'));
byId('markdownTab').addEventListener('click',()=>show('markdown'));
byId('copy').addEventListener('click',()=>{source.focus();source.select();status('Selected — press Ctrl+C')});
source.addEventListener('input',updateDownload);
byId('reset').addEventListener('click',()=>{
  drafts.delete(segments[current].path);source.value=segments[current].content;updateDownload();status('Reset');
});
select(0);
</script>
</body>
</html>`;

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, html);
console.log(`Built ${output} with ${segments.length} Markdown segments.`);
