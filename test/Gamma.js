/* global describe, it */

'use strict';

var assert = require('assert');
var stats  = require('../dist/bundle.js');
var Gamma  = stats.Gamma;

describe('Gamma', () => {
  
  describe('beta()', () => {
    it('Should return a value', () => {
      var b = Gamma.beta(1, 3);
      assert.ok(true);
    });
  });
  
  describe('gamma()', () => {
    it('Should return a value', () => {
      var g = Gamma.gamma(4);
      assert.strictEqual(g, 6);
      g = Gamma.gamma(10.43);
      assert.ok(true);
    });
  });
  
  describe('incompleteBeta()', () => {
    it('Should return a value', () => {
      var b = Gamma.incompleteBeta(1, 3, 0.4);
      assert.strictEqual(Number(b.toFixed(4)), 0.2613);
    });
  });
  
  describe('regIncompleteBeta()', () => {
    it('Should return a value', () => {
      var b = Gamma.regIncompleteBeta(1, 3, 0.4);
      assert.strictEqual(b, 0.784);
    });
  });
});