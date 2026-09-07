import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

test('builds one standalone studio with individually exportable Markdown', () => {
  const output = join(mkdtempSync(join(tmpdir(), 'workflow-studio-')), 'studio.html');

  execFileSync(process.execPath, ['artifact/build-workflow-studio.mjs', '--output', output], {
    cwd: new URL('..', import.meta.url),
  });

  const html = readFileSync(output, 'utf8');
  assert.match(html, /data-segment-count="20"/);
  assert.match(html, /workflow\/overall-process\.md/);
  assert.match(html, /workflow\/a2a-communication\.md/);
  assert.match(html, /personas\/yeah-boss\.md/);
  assert.match(html, /hypotheticals\/01-homepage-theme-colors\.md/);
  assert.match(html, /hypotheticals\/02-cookie-consent-config\.md/);
  assert.match(html, /hypotheticals\/03-unauthorized-toolkit-install\.md/);
  assert.match(html, /hypotheticals\/04-signup-form-backend\.md/);
  assert.match(html, /hypotheticals\/05-load-bearing-dead-code\.md/);
  assert.match(html, />Select text</);
  assert.match(html, /id="download" download/);
  assert.match(html, /data:text\/markdown;charset=utf-8/);
  assert.match(html, /let current=null/);
  assert.match(html, /if\(current!==null\)drafts\.set/);
  assert.match(html, /Reset/);
  assert.match(html, /Selected — press Ctrl\+C/);
  assert.doesNotMatch(html, /status\(copied\?'Copied'/);
  assert.match(html, /Workflow Comedy Studio/);
  assert.doesNotMatch(html, /data-segment-path="CONTEXT\.md"/);
});
