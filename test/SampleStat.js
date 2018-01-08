/* global describe, it */

'use strict';

var assert     = require('assert');
var SampleStat = require('../dist/bundle.js').SampleStat;

function roundIt (n, dec) {
  return Math.round(n * Math.pow(10, dec)) / Math.pow(10, dec);
}

describe('SampleStat', () => {
  it('Should instantiate', () => {
    var s = new SampleStat([2, 3, 1]);
    assert.deepEqual(s.values, [1, 2, 3]);
    assert.throws(() => { new SampleStat(); }, RangeError);
    assert.throws(() => { new SampleStat([]); }, RangeError);
  });
  it('Should return kurtosis', () => {
    var s = new SampleStat([1, 2, 3, 4, 7]);
    assert.strictEqual(roundIt(s.kurtosis(), 5), 1.12852);
  });
  it('Should return max', () => {
    var s = new SampleStat([2, 1, 4, 1]);
    assert.strictEqual(s.max(), 4);
  });
  it('Should return mean', () => {
    var s = new SampleStat([1, 2, 3, 4]);
    assert.strictEqual(s.mean(), 2.5);
  });
  it('Should return median', () => {
    var s = new SampleStat([1, 2, 3]);
    assert.strictEqual(s.median(), 2);
    s = new SampleStat([1, 2, 3, 4]);
    assert.strictEqual(s.median(), 2.5);
  });
  it('Should return min', () => {
    var s = new SampleStat([4, 1, 5]);
    assert.strictEqual(s.min(), 1);
  });
  it('Should return percentile', () => {
    var s = new SampleStat([1, 2, 3, 4, 5]);

    // Test exact index matches.
    assert.strictEqual(s.percentile(1), 0);
    assert.strictEqual(s.percentile(2), 0.25);
    assert.strictEqual(s.percentile(3), 0.5);
    assert.strictEqual(s.percentile(4), 0.75);
    assert.strictEqual(s.percentile(5), 1);

    // Test interpolation.
    assert.strictEqual(s.percentile(0), 0);
    assert.strictEqual(s.percentile(3.4), 0.6);
    assert.strictEqual(s.percentile(4.8), 0.95);
    assert.strictEqual(s.percentile(5.1), 1);

    // Check unven spacing.
    s = new SampleStat([1, 2, 5, 9, 10]);
    assert.strictEqual(roundIt(s.percentile(3), 4), 0.3333);
    assert.strictEqual(roundIt(s.percentile(4), 4), 0.4167);

    // Check duplicate values.
    s = new SampleStat([1, 1, 4, 5, 5]);
    assert.strictEqual(s.percentile(1), 0);
    assert.strictEqual(roundIt(s.percentile(2), 3), 0.333);
    assert.strictEqual(s.percentile(5), 0.75);
    assert.strictEqual(roundIt(s.percentile(3.1), 3), 0.425);
  });
  it('Should return quantile', () => {
    var s = new SampleStat([1, 2, 3, 4, 5]);

    // Test exact index matches.
    assert.strictEqual(s.quantile(0), 1);
    assert.strictEqual(s.quantile(0.25), 2);
    assert.strictEqual(s.quantile(0.5), 3);
    assert.strictEqual(s.quantile(0.75), 4);
    assert.strictEqual(s.quantile(1), 5);

    // Test interpolation.
    assert.strictEqual(s.quantile(0.1), 1.4);
    assert.strictEqual(s.quantile(0.2), 1.8);
    assert.strictEqual(s.quantile(0.3), 2.2);
    assert.strictEqual(s.quantile(0.7), 3.8);
    assert.strictEqual(s.quantile(0.8), 4.2);
    assert.strictEqual(s.quantile(0.95), 4.8);

    // Test out of range.
    assert.throws(() => { s.quantile(-1); }, RangeError);
    assert.throws(() => { s.quantile(2); }, RangeError);

    // Check uneven spacing.
    s = new SampleStat([1, 2, 5, 9, 10]);
    assert.strictEqual(roundIt(s.quantile(0.4), 3), 3.8);
    assert.strictEqual(roundIt(s.quantile(0.5), 3), 5);
    assert.strictEqual(roundIt(s.quantile(0.6), 3), 6.6);

    // Check duplicate values.
    s = new SampleStat([1, 1, 4, 5, 5]);
    assert.strictEqual(s.quantile(0.1), 1);
    assert.strictEqual(s.quantile(0.2), 1);
    assert.strictEqual(roundIt(s.quantile(0.3), 3), 1.6);
    assert.strictEqual(s.quantile(0.8), 5);
  });
  it('Should return range', () => {
    var s = new SampleStat([1, 2, 3, 3, 6]);
    assert.strictEqual(s.range(), 5);
  });
  it('Should return skew', () => {
    var s = new SampleStat([1, 2, 3, 4, 5]);
    assert.strictEqual(s.skew(), 0);
    s = new SampleStat([1, 2, 3, 4, 7]);
    assert.strictEqual(roundIt(s.skew(), 5), 1.03266);
  });
  it('Should return standard deviation', () => {
    var s = new SampleStat([1, 2, 3, 4, 5]);
    assert.strictEqual(roundIt(s.stdDev(), 5), 1.58114);
  });
  it('Should return variance', () => {
    var s = new SampleStat([1, 2, 3]);
    assert.strictEqual(s.variance(), (Math.pow(1-2,2)+Math.pow(2-2,2)+Math.pow(3-2,2)) / (3 - 1));
  });
});
