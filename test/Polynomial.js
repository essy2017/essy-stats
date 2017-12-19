/* global describe, it */

'use strict';

var assert     = require('assert');
var stats      = require('../dist/bundle.js');
var Polynomial = stats.Polynomial;

describe('Polynomial', () => {
  describe('p1evl()', () => {
    it('Should return a value', () => {
      var p = Polynomial.p1evl(2, [3, 2, 1], 2);
      assert.strictEqual(p, 12);
    });
  });
  describe('polevl()', () => {
    it('Should return a value', () => {
      var p = Polynomial.polevl(2, [1, 2, 3], 2);
      assert.strictEqual(p, 11);
    });
  });
});

