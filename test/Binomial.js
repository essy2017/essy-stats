/* global describe, it */

'use strict';

var assert = require('assert');
var stats  = require('../dist/bundle.js');

describe('Binomial', () => {
  it('Should calculate n choose k', () => {
    assert.strictEqual(stats.binomial(10, 3), 120);
  });
});
