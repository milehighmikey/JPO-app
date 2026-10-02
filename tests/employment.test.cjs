/* Run: node --test tests/employment.test.cjs. No network or real credentials used. */
const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Load the production TypeScript directly using the project's existing compiler.
function load(file) {
  const filename = path.resolve(file);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)(name => name.startsWith('.') ? load(path.resolve(path.dirname(filename), name + '.ts')) : require(name), module, module.exports);
  return module.exports;
}
const { POST } = load('src/app/api/employment/route.ts');
const { validateApplication } = load('src/lib/employment-application.ts');
const valid = () => ({ fullName: 'Test Applicant', phone: '815-555-0100', email: 'applicant@example.com', street: '10 Sample Street', city: 'Peru', state: 'IL', zip: '61354', position: 'Caregiver', preference: 'Either', acknowledgment: true, availability: ['Monday: Morning'], website: '', submissionId: 'a33cf5cd-b861-470d-a887-b8c67315e077' });
const request = (data, headers = {}) => new Request('http://localhost:3000/api/employment', { method: 'POST', headers: { 'content-type': 'application/json', origin: 'http://localhost:3000', ...headers }, body: typeof data === 'string' ? data : JSON.stringify(data) });
const originalFetch = global.fetch;
const names = ['RESEND_API_KEY', 'JPO_APPLICATION_EMAIL', 'JPO_APPLICATION_FROM_EMAIL'];
const originalEnv = Object.fromEntries(names.map(name => [name, process.env[name]]));
let sent;
beforeEach(() => {
  process.env.RESEND_API_KEY = 'test-only-key'; process.env.JPO_APPLICATION_EMAIL = 'private@example.com'; process.env.JPO_APPLICATION_FROM_EMAIL = 'sender@example.com';
  sent = []; global.fetch = async (url, options) => { sent.push({ url, ...options }); return Response.json({ id: 'test-message' }); };
});
afterEach(() => { global.fetch = originalFetch; for (const name of names) { if (originalEnv[name] === undefined) delete process.env[name]; else process.env[name] = originalEnv[name]; } });

test('server rejects missing required fields and acknowledgment', async () => {
  const response = await POST(request({ website: '', submissionId: valid().submissionId }));
  assert.equal(response.status, 422); const { errors } = await response.json();
  for (const name of ['fullName','phone','email','street','city','state','zip','position','preference','acknowledgment']) assert.ok(errors[name]);
  assert.equal(sent.length, 0);
});
test('validator rejects malformed and overlong values, optional enums, dates and forged availability', () => {
  const { errors } = validateApplication({ ...valid(), fullName: 'Name\r\nBcc: bad@example.com', email: 'invalid', zip: 'abc', phone: 'bad', preference: 'bogus', startDate: '2026-02-30', years: '-1', cna: 'maybe', interest: 'x'.repeat(3001), availability: ['Monday: unknown'] });
  for (const name of ['fullName','email','zip','phone','preference','startDate','years','cna','interest','availability']) assert.ok(errors[name]);
});
test('malformed JSON, spam, cross-origin and oversized requests never send', async () => {
  assert.equal((await POST(request('{'))).status, 400);
  assert.equal((await POST(request({ ...valid(), website: 'https://spam.example' }))).status, 400);
  assert.equal((await POST(request(valid(), { origin: 'https://other.example' }))).status, 403);
  assert.equal((await POST(request('x'.repeat(32001)))).status, 413);
  assert.equal(sent.length, 0);
});
test('missing server configuration gives failure without leaking configuration', async () => {
  delete process.env.RESEND_API_KEY;
  const response = await POST(request(valid())); assert.equal(response.status, 503);
  assert.equal(sent.length, 0); assert.ok(!(await response.text()).includes('private@example.com'));
});
test('uses server recipient, safe plain text, reply-to and stable retry key', async () => {
  const data = { ...valid(), interest: '<script>not HTML</script>', to: 'attacker@example.com' };
  const response = await POST(request(data)); assert.equal(response.status, 200); assert.deepEqual(await response.json(), { success: true });
  const email = JSON.parse(sent[0].body);
  assert.deepEqual(email.to, ['private@example.com']); assert.equal(email.reply_to, data.email);
  assert.equal(email.subject, 'New JPO Employment Application — Test Applicant');
  assert.equal(email.html, undefined); assert.ok(email.text.includes(data.interest)); assert.ok(email.text.includes('Monday: Morning')); assert.ok(email.text.includes('ACKNOWLEDGMENT'));
  await POST(request(data)); assert.equal(sent[0].headers['Idempotency-Key'], sent[1].headers['Idempotency-Key']);
  await POST(request({ ...data, position: 'Cook' })); assert.notEqual(sent[1].headers['Idempotency-Key'], sent[2].headers['Idempotency-Key']);
});
test('provider failure, missing receipt and timeout never report success', async () => {
  for (const mock of [async () => Response.json({ message: 'private details' }, { status: 429 }), async () => Response.json({}), async () => { throw new Error('timeout'); }]) {
    global.fetch = mock; const response = await POST(request(valid())); assert.equal(response.status, 502);
    const result = await response.json(); assert.ok(result.error); assert.equal(result.success, undefined); assert.ok(!result.error.includes('private details'));
  }
});
