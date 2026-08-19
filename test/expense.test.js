const test = require('node:test');
const assert = require('node:assert/strict');
const { validate, summary, expenses } = require('../server');

test('validates expense input', () => { assert.equal(validate({ description: 'Coffee', amount: 4, category: 'Food' }), true); assert.equal(validate({ description: '', amount: 4, category: 'Food' }), false); });
test('summarizes expense totals by category', () => { expenses.push({ amount: 4, category: 'Food' }, { amount: 10, category: 'Home' }); const result = summary(); assert.equal(result.total, 14); assert.equal(result.byCategory.Food, 4); expenses.length = 0; });
