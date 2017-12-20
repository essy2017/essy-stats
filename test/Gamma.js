/* global describe, it */

'use strict';

var assert = require('assert');
var stats  = require('../dist/bundle.js');

describe('Gamma', () => {
  
  describe('beta()', () => {
    it('Should return a value', () => {
      var b = stats.beta(1.5, 0.2);
      assert.strictEqual(Number(b.toFixed(4)), 4.4776);
    });
  });
  
  describe('gamma()', () => {
    it('Should return a value', () => {
      var g = stats.gamma(2.5);
      assert.strictEqual(Number(g.toFixed(4)), 1.3293);
    });
  });
  
  describe('incBeta()', () => {
    it('Should return a value', () => {
      var b = stats.incBeta(1, 3, 0.4);
      assert.strictEqual(Number(b.toFixed(4)), 0.2613);
    });
  });
  
  describe('invIncBeta()', () => {
    it('Should return a value', () => {
      var b = stats.invIncBeta(0.3, 1, 3);
      assert.strictEqual(Number(b.toFixed(4)), 0.5358);
    });
  });
  
  describe('regIncBeta()', () => {
    it('Should return a value', () => {
      var b = stats.regIncBeta(1, 3, 0.4);
      assert.strictEqual(b, 0.784);
    });
  });
});