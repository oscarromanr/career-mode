'use strict';
const fs = require('fs');
const src = fs.readFileSync('test/fixtures/star.js', 'utf8');
const m = src.match(/localStorage\.setItem\('cm26-save-v1', (".*")\);/s);
if (!m) { console.error('no match'); process.exit(1); }
const obj = JSON.parse(JSON.parse(m[1])); // outer: JS string literal, inner: actual JSON
fs.writeFileSync('test/fixtures/export-test.json', JSON.stringify(obj, null, 2));
console.log('export-test.json written,', fs.statSync('test/fixtures/export-test.json').size, 'bytes');
