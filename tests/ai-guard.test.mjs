// Run: npm test (node --test tests/ai-guard.test.mjs; Node 22.18+ strips the guard's TypeScript types).
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test, beforeEach } from 'node:test';
import { guardAiRequest, resetAiGuardForTests } from '../src/lib/ai-guard.ts';

const ENV_NAMES = ['AI_GUARD_DISABLED', 'AI_RATE_PER_IP_PER_10MIN', 'AI_DAILY_CAP', 'AI_MAX_BODY_CHARS_TTS', 'AI_MAX_BODY_CHARS_CHAT'];
const T0 = Date.UTC(2026, 10, 19, 4, 0, 0); // 12:00 Taipei
const req = (body = '{"text":"hi"}', ip = '203.0.113.7') =>
  new Request('http://localhost/api/x', { method: 'POST', body, headers: { 'x-forwarded-for': `${ip}, 10.0.0.1` } });

beforeEach(() => {
  for (const n of ENV_NAMES) delete process.env[n];
  resetAiGuardForTests();
});

test('a normal request passes', async () => {
  assert.equal(await guardAiRequest(req(), 'chat', T0), null);
});

test('an oversized body is refused with 413 before any counting', async () => {
  const r = await guardAiRequest(req('x'.repeat(20_001)), 'tts', T0);
  assert.equal(r.status, 413);
  process.env.AI_RATE_PER_IP_PER_10MIN = '1';
  assert.equal(await guardAiRequest(req(), 'tts', T0), null, 'the 413 did not use the IP budget');
});

test('per-IP limit: 429 with Retry-After, other IPs unaffected, window resets after 10 minutes', async () => {
  process.env.AI_RATE_PER_IP_PER_10MIN = '3';
  for (let i = 0; i < 3; i++) assert.equal(await guardAiRequest(req(), 'teach', T0 + i), null);
  const r = await guardAiRequest(req(), 'teach', T0 + 10);
  assert.equal(r.status, 429);
  assert.ok(Number(r.headers.get('Retry-After')) > 0);
  assert.equal(await guardAiRequest(req('{}', '198.51.100.9'), 'teach', T0 + 10), null);
  assert.equal(await guardAiRequest(req(), 'teach', T0 + 10 * 60 * 1000), null);
});

test('daily cap: 429 after the cap, resets on the next Taipei day', async () => {
  process.env.AI_DAILY_CAP = '2';
  assert.equal(await guardAiRequest(req('{}', '1.1.1.1'), 'chat', T0), null);
  assert.equal(await guardAiRequest(req('{}', '2.2.2.2'), 'chat', T0), null);
  assert.equal((await guardAiRequest(req('{}', '3.3.3.3'), 'chat', T0)).status, 429);
  const nextDayTaipei = Date.UTC(2026, 10, 19, 16, 0, 1); // 00:00:01 on 11-20 Taipei
  assert.equal(await guardAiRequest(req('{}', '3.3.3.3'), 'chat', nextDayTaipei), null);
});

test('0 switches a limit off; AI_GUARD_DISABLED=1 switches the guard off', async () => {
  process.env.AI_RATE_PER_IP_PER_10MIN = '0';
  for (let i = 0; i < 50; i++) assert.equal(await guardAiRequest(req(), 'tts', T0), null);
  process.env.AI_GUARD_DISABLED = '1';
  assert.equal(await guardAiRequest(req('x'.repeat(5_000_000)), 'tts', T0), null);
});

test('every paid AI route runs the guard before it reads the body', async () => {
  for (const route of ['chat', 'lesson-chat', 'teach', 'tts']) {
    const src = await readFile(new URL(`../src/app/api/${route}/route.ts`, import.meta.url), 'utf8');
    const guard = src.indexOf(`guardAiRequest(request, "${route}")`);
    assert.ok(guard > 0, `${route} calls the guard`);
    assert.ok(guard < src.indexOf('request.json()'), `${route} guards before reading the body`);
  }
});
