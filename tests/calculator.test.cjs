const test = require('node:test');
const assert = require('node:assert/strict');
const parseArithmetic = require('../calculator.js');

test('calculator supports precedence, parentheses, unary signs and decimals', () => {
  assert.equal(parseArithmetic('2+2*3'), '8');
  assert.equal(parseArithmetic('(2+2)*3'), '12');
  assert.equal(parseArithmetic('-4/2'), '-2');
  assert.equal(parseArithmetic('0.1+0.2'), '0.3');
});

test('calculator rejects malformed and unsafe input', () => {
  for (const expression of ['1/0', '2+', '1**2', 'alert(1)', '']) {
    assert.throws(() => parseArithmetic(expression));
  }
});
