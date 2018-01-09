'use strict';

/**
 * Calculates n choose k.
 * @source cern.jet.math.Arithmetic
 * @method binomial
 * @param n {Number}
 * @param k {Number}
 * @return {Number}
 */
export function binomial (n, k) {
  if (k < 0) return 0;
  if (k === 0) return 1;
  if (k === 1) return n;

  let a   = n - k + 1;
  let b   = 1;
  let bin = 1;

  for (let i = k; i-- > 0; ) {
    bin *= (a++) / (b++);
  }
  return bin;
}
