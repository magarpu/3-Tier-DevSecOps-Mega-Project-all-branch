const test = require('node:test');
const assert = require('node:assert/strict');

const { resolveDbHosts } = require('../models/db');

test('resolveDbHosts adds Docker-compatible fallback hosts', () => {
  const hosts = resolveDbHosts({ DB_HOST: '127.0.0.1' });

  assert.ok(hosts.includes('127.0.0.1'));
  assert.ok(hosts.includes('host.docker.internal'));
  assert.ok(hosts.includes('localhost'));
});
