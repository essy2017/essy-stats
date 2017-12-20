/* global describe, it */

'use strict';

var assert = require('assert');
var stats  = require('../dist/bundle.js');

describe('Polynomial', () => {
  describe('p1evl()', () => {
    it('Should return a value', () => {
      var p = stats.p1evl(2, [3, 2, 1], 2);
      assert.strictEqual(p, 12);
    });
  });
  describe('polevl()', () => {
    it('Should return a value', () => {
      var p = stats.polevl(2, [1, 2, 3], 2);
      assert.strictEqual(p, 11);
    });
  });
});

