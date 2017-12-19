'use strict';
  
/**
 * @source cern.jet.math.Polynomial
 * Evaluates the given polynomial of degree <tt>N</tt> at <tt>x</tt>, assuming coefficient of N is 1.0.
 * Otherwise same as <tt>polevl()</tt>.
 * <pre>
 *                     2          N
 * y  =  C  + C x + C x  +...+ C x
 *        0    1     2          N
 *
 * where C  = 1 and hence is omitted from the array.
 *        N
 *
 * Coefficients are stored in reverse order:
 *
 * coef[0] = C  , ..., coef[N-1] = C  .
 *            N-1                   0
 *
 * Calling arguments are otherwise the same as polevl().
 * </pre>
 * In the interest of speed, there are no checks for out of bounds arithmetic.
 *
 * @method p1evl
 * @param x argument to the polynomial.
 * @param coef the coefficients of the polynomial.
 * @param N the degree of the polynomial.
 */
export function p1evl (x, coef, N) {
	
  var ans = x + coef[0];

	for (let i=1; i<N; i++) { 
    ans = ans*x+coef[i]; 
  }

	return ans;
}

/**
 * @source cern.jet.math.Polynomial 
 * Evaluates the given polynomial of degree <tt>N</tt> at <tt>x</tt>.
 * <pre>
 *                     2          N
 * y  =  C  + C x + C x  +...+ C x
 *        0    1     2          N
 *
 * Coefficients are stored in reverse order:
 *
 * coef[0] = C  , ..., coef[N] = C  .
 *            N                   0
 * </pre>
 * In the interest of speed, there are no checks for out of bounds arithmetic.
 *
 * @param x argument to the polynomial.
 * @param coef the coefficients of the polynomial.
 * @param N the degree of the polynomial.
 */
export function polevl (x, coef, N) {
	var ans = coef[0];

	for (let i=1; i<=N; i++) {
    ans = ans*x+coef[i];
  }

	return ans;
}