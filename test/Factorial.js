/* global describe, it */

'use strict';

var assert = require('assert');
var stats  = require('../dist/bundle.js');
var fac    = stats.factorial;

describe('Factorial', () => {
  it('Should calculate', () => {
    assert.strictEqual(fac(0), 1);
    assert.strictEqual(fac(1), 1);
    assert.strictEqual(fac(2), 2);
    assert.strictEqual(fac(10), 3628800);
    assert.strictEqual(fac(21), 5.109094217170944E19);
  });
});
