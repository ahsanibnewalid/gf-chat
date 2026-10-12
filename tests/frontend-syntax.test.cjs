'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

for (const filename of ['index.html', 'admin.html']) {
  test('inline scripts parse in ' + filename, () => {
    const html = fs.readFileSync(path.join(__dirname, '..', filename), 'utf8');
    const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
      .filter(match => !/\bsrc\s*=/.test(match[1]))
      .map(match => match[2])
      .filter(source => source.trim());
    assert.ok(scripts.length > 0, 'expected inline JavaScript');
    for (const source of scripts) assert.doesNotThrow(() => new Function(source));
  });
}
