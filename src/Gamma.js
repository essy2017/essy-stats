'use strict';

import * as Polynomial from './Polynomial';

const MACHEP =  1.11022302462515654042E-16;
const MAXLOG =  7.09782712893383996732E2;
const MINLOG = -7.451332191019412076235E2;
const MAXGAM = 171.624376956302725;
const SQTPI  =  2.50662827463100050242E0;
const SQRTH  =  7.07106781186547524401E-1;
const LOGPI  =  1.14472988584940017414;

const big    = 4.503599627370496e15;
const biginv =  2.22044604925031308085e-16;

/**
 * Returns beta function.
 * @source cern.jet.stat.Gamma
 * @method beta
 * @param a {Number} Alpha parameter.
 * @param b {Number} Beta parameter.
 */
function beta (a, b) {

  let y;

	y = a + b;
	y = gamma(y);
	if( y == 0.0 ) return 1.0;

	if( a > b ) {
		y = gamma(a)/y;
		y *= gamma(b);
	}
	else {
		y = gamma(b)/y;
		y *= gamma(a);
	}

	return(y);
}

/**
 * Returns the error function of the normal distribution; formerly named <tt>erf</tt>.
 * The integral is
 * <pre>
 *                           x
 *                            -
 *                 2         | |          2
 *   erf(x)  =  --------     |    exp( - t  ) dt.
 *              sqrt(pi)   | |
 *                          -
 *                           0
 * </pre>
 * <b>Implementation:</b>
 * For <tt>0 <= |x| < 1, erf(x) = x * P4(x**2)/Q5(x**2)</tt>; otherwise
 * <tt>erf(x) = 1 - erfc(x)</tt>.
 * <p>
 * Code adapted from the <A HREF="http://www.sci.usq.edu.au/staff/leighb/graph/Top.html">Java 2D Graph Package 2.4</A>,
 * which in turn is a port from the <A HREF="http://people.ne.mediaone.net/moshier/index.html#Cephes">Cephes 2.2</A> Math Library (C).
 *
 * @param a the argument to the function.
 */
function erf (x) {
	let y, z;
	const T = [
    9.60497373987051638749E0,
    9.00260197203842689217E1,
    2.23200534594684319226E3,
    7.00332514112805075473E3,
    5.55923013010394962768E4
  ];
	const U = [
	   //1.00000000000000000000E0,
		 3.35617141647503099647E1,
		 5.21357949780152679795E2,
		 4.59432382970980127987E3,
		 2.26290000613890934246E4,
		 4.92673942608635921086E4
	];

	if( Math.abs(x) > 1.0 ) return( 1.0 - erfComplemented(x) );
	z = x * x;
	y = x * Polynomial.polevl( z, T, 4 ) / Polynomial.p1evl( z, U, 5 );
	return y;
}

/**
 * Returns the complementary Error function of the normal distribution; formerly named <tt>erfc</tt>.
 * <pre>
 *  1 - erf(x) =
 *
 *                           inf.
 *                             -
 *                  2         | |          2
 *   erfc(x)  =  --------     |    exp( - t  ) dt
 *               sqrt(pi)   | |
 *                           -
 *                            x
 * </pre>
 * <b>Implementation:</b>
 * For small x, <tt>erfc(x) = 1 - erf(x)</tt>; otherwise rational
 * approximations are computed.
 * <p>
 * Code adapted from the <A HREF="http://www.sci.usq.edu.au/staff/leighb/graph/Top.html">Java 2D Graph Package 2.4</A>,
 * which in turn is a port from the <A HREF="http://people.ne.mediaone.net/moshier/index.html#Cephes">Cephes 2.2</A> Math Library (C).
 *
 * @param a the argument to the function.
 */
function erfComplemented (a) {

  let x,y,z,p,q;

	const P = [
					 2.46196981473530512524E-10,
					 5.64189564831068821977E-1,
					 7.46321056442269912687E0,
					 4.86371970985681366614E1,
					 1.96520832956077098242E2,
					 5.26445194995477358631E2,
					 9.34528527171957607540E2,
					 1.02755188689515710272E3,
					 5.57535335369399327526E2
         ];
	const Q = [
					//1.0
					  1.32281951154744992508E1,
					  8.67072140885989742329E1,
					  3.54937778887819891062E2,
					  9.75708501743205489753E2,
					  1.82390916687909736289E3,
					  2.24633760818710981792E3,
					  1.65666309194161350182E3,
					  5.57535340817727675546E2
          ];

	const R = [
					  5.64189583547755073984E-1,
					  1.27536670759978104416E0,
					  5.01905042251180477414E0,
					  6.16021097993053585195E0,
					  7.40974269950448939160E0,
					  2.97886665372100240670E0
          ];
	const S = [
					//1.00000000000000000000E0,
					  2.26052863220117276590E0,
					  9.39603524938001434673E0,
					  1.20489539808096656605E1,
					  1.70814450747565897222E1,
					  9.60896809063285878198E0,
					  3.36907645100081516050E0
          ];

	if( a < 0.0 )   x = -a;
	else            x = a;

	if( x < 1.0 )   return 1.0 - erf(a);

	z = -a * a;

	if( z < -MAXLOG ) {
		 if( a < 0 )  return( 2.0 );
		 else         return( 0.0 );
	}

	z = Math.exp(z);

	if( x < 8.0 ) {
	  p = Polynomial.polevl( x, P, 8 );
	  q = Polynomial.p1evl( x, Q, 8 );
	} else {
	  p = Polynomial.polevl( x, R, 5 );
	  q = Polynomial.p1evl( x, S, 6 );
	}

	y = (z * p)/q;

	if( a < 0 ) y = 2.0 - y;

	if( y == 0.0 ) {
			if( a < 0 ) return 2.0;
			else        return( 0.0 );
	 }

	return y;
}

/**
 * Returns the Gamma function of the argument.
 * @source cern.jet.stat.Gamma
 * @method gamma
 */
function gamma (x) {

  const P = [
    1.60119522476751861407E-4,
    1.19135147006586384913E-3,
    1.04213797561761569935E-2,
    4.76367800457137231464E-2,
    2.07448227648435975150E-1,
    4.94214826801497100753E-1,
    9.99999999999999996796E-1
  ];
  const Q = [
	   -2.31581873324120129819E-5,
		  5.39605580493303397842E-4,
	   -4.45641913851797240494E-3,
		  1.18139785222060435552E-2,
		  3.58236398605498653373E-2,
	   -2.34591795718243348568E-1,
		  7.14304917030273074085E-2,
		  1.00000000000000000320E0
    ];

  let p, z, i;
  let q = Math.abs(x);

  if( q > 33.0 ) {
    if( x < 0.0 ) {
		  p = Math.floor(q);
	    if( p == q ) throw new Error("gamma: overflow");
	    i = Math.round(p);
	    z = q - p;
	    if( z > 0.5 ) {
		    p += 1.0;
		    z = q - p;
	    }
	    z = q * Math.sin( Math.PI * z );
	    if( z == 0.0 ) throw new Error("gamma: overflow");
	    z = Math.abs(z);
	    z = Math.PI/(z * stirlingFormula(q) );

		  return -z;
    } else {
	    return stirlingFormula(x);
    }
  }

  z = 1.0;
  while( x >= 3.0 ) {
    x -= 1.0;
	  z *= x;
  }

  while( x < 0.0 ) {
	  if( x == 0.0 ) {
			throw new Error("gamma: singular");
		} else if( x > -1.E-9 ) {
			return( z/((1.0 + 0.5772156649015329 * x) * x) );
		}
	  z /= x;
	  x += 1.0;
  }

  while( x < 2.0 ) {
	  if( x == 0.0 ) {
			throw new Error("gamma: singular");
		} else if( x < 1.e-9 ) {
  	  return( z/((1.0 + 0.5772156649015329 * x) * x) );
		}
	  z /= x;
	  x += 1.0;
  }

	if( (x == 2.0) || (x == 3.0) ) 	return z;

	x -= 2.0;
	p = Polynomial.polevl( x, P, 6 );
	q = Polynomial.polevl( x, Q, 7 );

  return  z * p / q;

}

/**
 * Incomplete beta function.
 * @method incBeta
 * @param a {Number} Alpha.
 * @param b {Number} Beta.
 * @param x {Number} End point.
 */
function incBeta (a, b, x) {
  return beta(a, b) * regIncBeta(a, b, x);
}


/**
 * Inverse incomplete beta function.
 * @method invIncBeta
 * @param p {Number} Probability.
 * @param alpha {Number}
 * @param beta {Number}
 */
function invIncBeta (p, alpha, beta) {

  let x = 0;
  let a = 0;
  let b = 1;
  const precision = Math.pow(10, -6);

  while (b - a > precision) {
    x = (a + b) / 2;
    if (incBeta(alpha, beta, x) > p) {
      b = x;
    }
    else {
      a = x;
    }
  }

  return x;
}

/**
 * Regularized inverse incomplete beta function.
 * @method regInvIncBeta
 * @param p {Number} Probability.
 * @param alpha {Number}
 * @param beta {Number}
 */
function regInvIncBeta (p, alpha, beta) {

  let x = 0;
  let a = 0;
  let b = 1;
  const precision = Math.pow(10, -6);

  while (b - a > precision) {
    x = (a + b) / 2;
    if (regIncBeta(alpha, beta, x) > p) {
      b = x;
    }
    else {
      a = x;
    }
  }

  return x;
}

/**
 * Returns the Incomplete Beta Function evaluated from zero to xx.
 * @source cern.jet.stat.Gamma
 * @method regIncBeta
 * @param aa the alpha parameter of the beta distribution.
 * @param bb the beta parameter of the beta distribution.
 * @param xx the integration end point.
 */
function regIncBeta (aa, bb, xx) {

  let a, b, t, x, xc, w, y, flag;

	if( aa <= 0.0 || bb <= 0.0 ) throw new Error("ibeta: Domain error!");

	if( (xx <= 0.0) || ( xx >= 1.0) ) {
  	if( xx == 0.0 ) return 0.0;
   	if( xx == 1.0 ) return 1.0;
		throw new Error("ibeta: Domain error!");
	}

	flag = false;
	if( (bb * xx) <= 1.0 && xx <= 0.95) {
	  t = powerSeries(aa, bb, xx);
		return t;
	}

	w = 1.0 - xx;

	/* Reverse a and b if x is greater than the mean. */
	if( xx > (aa/(aa+bb)) ) {
	  flag = true;
	  a = bb;
	  b = aa;
	  xc = xx;
	  x = w;
	} else {
  	a = aa;
	  b = bb;
	  xc = w;
	  x = xx;
	}

	if( flag  && (b * x) <= 1.0 && x <= 0.95) {
 	  t = powerSeries(a, b, x);
	  if( t <= MACHEP ) 	t = 1.0 - MACHEP;
	  else  		        t = 1.0 - t;
		return t;
	}

	/* Choose expansion for better convergence. */
	y = x * (a+b-2.0) - (a-1.0);
	if( y < 0.0 )
	  w = incompleteBetaFraction1( a, b, x );
	else
	  w = incompleteBetaFraction2( a, b, x ) / xc;

	/* Multiply w by the factor
	  a      b   _             _     _
	  x  (1-x)   | (a+b) / ( a | (a) | (b) ) .   */

	y = a * Math.log(x);
	t = b * Math.log(xc);
	if( (a+b) < MAXGAM && Math.abs(y) < MAXLOG && Math.abs(t) < MAXLOG ) {
	  t = Math.pow(xc,b);
	  t *= Math.pow(x,a);
	  t /= a;
	  t *= w;
	  t *= gamma(a+b) / (gamma(a) * gamma(b));
	  if( flag ) {
 	    if( t <= MACHEP ) 	t = 1.0 - MACHEP;
	      else  		        t = 1.0 - t;
	  }
		return t;
	}

  /* Resort to logarithms.  */
	y += t + logGamma(a+b) - logGamma(a) - logGamma(b);
	y += Math.log(w/a);
	if( y < MINLOG )
	                   t = 0.0;
  else
	                    t = Math.exp(y);

	if( flag ) {
 	  if( t <= MACHEP ) 	t = 1.0 - MACHEP;
	  else    		        t = 1.0 - t;
	}

  return t;
}

/**
 * @source cern.jet.stat.Gamma
 * Continued fraction expansion #1 for incomplete beta integral; formerly named <tt>incbcf</tt>.
 * @method incompleteBetaFraction1
 */
function incompleteBetaFraction1 (a, b, x) {

  let xk, pk, pkm1, pkm2, qk, qkm1, qkm2;
	let k1, k2, k3, k4, k5, k6, k7, k8;
	let r, t, ans, thresh;
	let n;

	k1 = a;
	k2 = a + b;
	k3 = a;
	k4 = a + 1.0;
	k5 = 1.0;
	k6 = b - 1.0;
	k7 = k4;
	k8 = a + 2.0;

	pkm2 = 0.0;
	qkm2 = 1.0;
	pkm1 = 1.0;
	qkm1 = 1.0;
	ans = 1.0;
	r = 1.0;
	n = 0;
	thresh = 3.0 * MACHEP;
	do {
	  xk = -( x * k1 * k2 )/( k3 * k4 );
	  pk = pkm1 +  pkm2 * xk;
	  qk = qkm1 +  qkm2 * xk;
	  pkm2 = pkm1;
	  pkm1 = pk;
	  qkm2 = qkm1;
	  qkm1 = qk;

	  xk = ( x * k5 * k6 )/( k7 * k8 );
	  pk = pkm1 +  pkm2 * xk;
	  qk = qkm1 +  qkm2 * xk;
	  pkm2 = pkm1;
	  pkm1 = pk;
	  qkm2 = qkm1;
	  qkm1 = qk;

	  if( qk != 0 )		r = pk/qk;
	  if( r != 0 ) {
		  t = Math.abs( (ans - r)/r );
		  ans = r;
		}	else
		  t = 1.0;

	  if( t < thresh ) return ans;

	  k1 += 1.0;
		k2 += 1.0;
	  k3 += 2.0;
	  k4 += 2.0;
	  k5 += 1.0;
	  k6 -= 1.0;
	  k7 += 2.0;
	  k8 += 2.0;

	  if( (Math.abs(qk) + Math.abs(pk)) > big ) {
	  	pkm2 *= biginv;
	  	pkm1 *= biginv;
	  	qkm2 *= biginv;
	  	qkm1 *= biginv;
		}
	  if( (Math.abs(qk) < biginv) || (Math.abs(pk) < biginv) ) {
	  	pkm2 *= big;
	  	pkm1 *= big;
	  	qkm2 *= big;
	  	qkm1 *= big;
		}
	} while( ++n < 300 );

	return ans;
}

/**
 * @source cern.jet.stat.Gamma
 * Continued fraction expansion #2 for incomplete beta integral; formerly named <tt>incbd</tt>.
 * @method incompleteBetaFraction2
 */
function incompleteBetaFraction2 (a, b, x) {

  let xk, pk, pkm1, pkm2, qk, qkm1, qkm2;
	let k1, k2, k3, k4, k5, k6, k7, k8;
	let r, t, ans, z, thresh;
	let n;

	k1 = a;
	k2 = b - 1.0;
	k3 = a;
	k4 = a + 1.0;
	k5 = 1.0;
	k6 = a + b;
	k7 = a + 1.0;;
	k8 = a + 2.0;

	pkm2 = 0.0;
	qkm2 = 1.0;
	pkm1 = 1.0;
	qkm1 = 1.0;
	z = x / (1.0-x);
	ans = 1.0;
	r = 1.0;
	n = 0;
	thresh = 3.0 * MACHEP;
	do {
	  xk = -( z * k1 * k2 )/( k3 * k4 );
	  pk = pkm1 +  pkm2 * xk;
	  qk = qkm1 +  qkm2 * xk;
	  pkm2 = pkm1;
	  pkm1 = pk;
	  qkm2 = qkm1;
	  qkm1 = qk;

	  xk = ( z * k5 * k6 )/( k7 * k8 );
	  pk = pkm1 +  pkm2 * xk;
	  qk = qkm1 +  qkm2 * xk;
	  pkm2 = pkm1;
	  pkm1 = pk;
	  qkm2 = qkm1;
	  qkm1 = qk;

	  if( qk != 0 )  r = pk/qk;
	  if( r != 0 ) {
		  t = Math.abs( (ans - r)/r );
		  ans = r;
		} else
		  t = 1.0;

	  if( t < thresh ) return ans;

	  k1 += 1.0;
	  k2 -= 1.0;
	  k3 += 2.0;
	  k4 += 2.0;
	  k5 += 1.0;
	  k6 += 1.0;
	  k7 += 2.0;
	  k8 += 2.0;

	  if( (Math.abs(qk) + Math.abs(pk)) > big ) {
		  pkm2 *= biginv;
		  pkm1 *= biginv;
		  qkm2 *= biginv;
		  qkm1 *= biginv;
		}
	  if( (Math.abs(qk) < biginv) || (Math.abs(pk) < biginv) ) {
		  pkm2 *= big;
		  pkm1 *= big;
		  qkm2 *= big;
		  qkm1 *= big;
		}
	} while( ++n < 300 );

	return ans;
}

/**
 * @source cern.jet.stat.Gamma
 * Returns the natural logarithm of the gamma function; formerly named <tt>lgamma</tt>.
 * @method logGamma
 */
function logGamma (x) {
	let p, q, w, z;

	const A = [
    8.11614167470508450300E-4,
    -5.95061904284301438324E-4,
    7.93650340457716943945E-4,
    -2.77777777730099687205E-3,
    8.33333333333331927722E-2
	];
	const B = [
    -1.37825152569120859100E3,
    -3.88016315134637840924E4,
    -3.31612992738871184744E5,
    -1.16237097492762307383E6,
    -1.72173700820839662146E6,
    -8.53555664245765465627E5
	];
	const C = [
    /* 1.00000000000000000000E0, */
    -3.51815701436523470549E2,
    -1.70642106651881159223E4,
    -2.20528590553854454839E5,
    -1.13933444367982507207E6,
    -2.53252307177582951285E6,
    -2.01889141433532773231E6
  ];

	if( x < -34.0 ) {
    q = -x;
	  w = logGamma(q);
	  p = Math.floor(q);
	  if( p == q ) throw new Error("lgam: Overflow");
	  z = q - p;
	  if( z > 0.5 ) {
		  p += 1.0;
		  z = p - q;
 	  }
	  z = q * Math.sin( Math.PI * z );
	  if( z == 0.0 ) throw new Error("lgamma: Overflow");
	  z = LOGPI - Math.log( z ) - w;
	  return z;
	}

	if( x < 13.0 ) {
  	z = 1.0;
	  while( x >= 3.0 ) {
		  x -= 1.0;
		  z *= x;
	  }
	  while( x < 2.0 ) {
		  if( x == 0.0 ) throw new Error("lgamma: Overflow");
		  z /= x;
		  x += 1.0;
	  }
	  if( z < 0.0 ) z = -z;
	  if( x == 2.0 ) return Math.log(z);
	  x -= 2.0;
	  p = x * Polynomial.polevl( x, B, 5 ) / Polynomial.p1evl( x, C, 6);
 	  return( Math.log(z) + p );
	}

	if( x > 2.556348e305 ) throw new Error("lgamma: Overflow");

	q = ( x - 0.5 ) * Math.log(x) - x + 0.91893853320467274178;

	if( x > 1.0e8 ) return( q );

	p = 1.0/(x*x);
	if( x >= 1000.0 )
	  q += ((   7.9365079365079365079365e-4 * p
	          - 2.7777777777777777777778e-3) *p
		        + 0.0833333333333333333333) / x;
	else
	  q += Polynomial.polevl( p, A, 4 ) / x;

  return q;
}


/**
 * Returns the Incomplete Gamma function; formerly named <tt>igamma</tt>.
 * @source cern.jet.stat.Gamma
 * @method lowerIncGamma
 * @param a the parameter of the gamma distribution.
 * @param x the integration end point.
 */
function lowerIncGamma (a, x) {

  let ans, ax, c, r;

	if( x <= 0 || a <= 0 ) return 0.0;

	if( x > 1.0 && x > a ) return 1.0 - upperIncGamma(a,x);

	/* Compute  x**a * exp(-x) / gamma(a)  */
	ax = a * Math.log(x) - x - logGamma(a);
	if( ax < -MAXLOG ) return( 0.0 );

	ax = Math.exp(ax);

	/* power series */
	r = a;
	c = 1.0;
	ans = 1.0;

	do {
    r += 1.0;
	  c *= x/r;
	  ans += c;
	} while ( c/ans > MACHEP );

	return( ans * ax/a );

}

/**
 * Returns the Complemented Incomplete Gamma function; formerly named <tt>igamc</tt>.
 * @source cern.jet.stat.Gamma
 * @method upperIncGamma
 * @param a the parameter of the gamma distribution.
 * @param x the integration start point.
 */
function upperIncGamma (a, x) {

	let ans, ax, c, yc, r, t, y, z;
	let pk, pkm1, pkm2, qk, qkm1, qkm2;

	if( x <= 0 || a <= 0 ) return 1.0;

	if( x < 1.0 || x < a ) return 1.0 - lowerIncGamma(a,x);

	ax = a * Math.log(x) - x - logGamma(a);
	if( ax < -MAXLOG ) return 0.0;

	ax = Math.exp(ax);

	/* continued fraction */
	y = 1.0 - a;
	z = x + y + 1.0;
	c = 0.0;
	pkm2 = 1.0;
	qkm2 = x;
	pkm1 = x + 1.0;
	qkm1 = z * x;
	ans = pkm1/qkm1;

	do {
    c += 1.0;
	  y += 1.0;
	  z += 2.0;
	  yc = y * c;
	  pk = pkm1 * z  -  pkm2 * yc;
	  qk = qkm1 * z  -  qkm2 * yc;
	  if( qk != 0 ) {
		  r = pk/qk;
		  t = Math.abs( (ans - r)/r );
		  ans = r;
	  } else
		  t = 1.0;

	  pkm2 = pkm1;
	  pkm1 = pk;
	  qkm2 = qkm1;
	  qkm1 = qk;
	  if( Math.abs(pk) > big ) {
		  pkm2 *= biginv;
		  pkm1 *= biginv;
		  qkm2 *= biginv;
		  qkm1 *= biginv;
	  }
	} while( t > MACHEP );

	return ans * ax;
}

/**
 * @source cern.jet.stat.Gamma
 * Power series for incomplete beta integral; formerly named <tt>pseries</tt>.
 * Use when b*x is small and x not too close to 1.
 * @method powerSeries
 */
function powerSeries (a, b, x) {
	let s, t, u, v, n, t1, z, ai;

	ai = 1.0 / a;
	u = (1.0 - b) * x;
	v = u / (a + 1.0);
	t1 = v;
	t = u;
	n = 2.0;
	s = 0.0;
	z = MACHEP * ai;
	while( Math.abs(v) > z ) {
	  u = (n - b) * x / n;
	  t *= u;
	  v = t / (a + n);
	  s += v;
	  n += 1.0;
	}
	s += t1;
	s += ai;

	u = a * Math.log(x);
	if ( (a+b) < MAXGAM && Math.abs(u) < MAXLOG ) {
	        t = gamma(a+b)/(gamma(a)*gamma(b));
	        s = s * t * Math.pow(x,a);
	    } else {
	       t = logGamma(a+b) - logGamma(a) - logGamma(b) + u + Math.log(s);
	       if( t < MINLOG ) 	s = 0.0;
	       else  	            s = Math.exp(t);
	    }
	return s;
}

/**
 * @source cern.jet.stat.Gamma
 * Returns the Gamma function computed by Stirling's formula; formerly named <tt>stirf</tt>.
 * The polynomial STIR is valid for 33 <= x <= 172.
 * @method stirlingFormula
 */
function stirlingFormula (x) {
  const STIR = [
		 7.87311395793093628397E-4,
		-2.29549961613378126380E-4,
		-2.68132617805781232825E-3,
		 3.47222221605458667310E-3,
		 8.33333333333482257126E-2,
	];
	const MAXSTIR = 143.01608;

	let w = 1.0/x;
	let y = Math.exp(x);

	w = 1.0 + w * Polynomial.polevl( w, STIR, 4 );

	if( x > MAXSTIR ) {
	  /* Avoid overflow in Math.pow() */
	  let v = Math.pow( x, 0.5 * x - 0.25 );
	  y = v * (v / y);
	} else {
		y = Math.pow( x, x - 0.5 ) / y;
	}
	y = SQTPI * y * w;
	return y;
}


export default {
  beta            : beta,
  erf             : erf,
  gamma           : gamma,
  incBeta         : incBeta,
  invIncBeta      : invIncBeta,
  logGamma        : logGamma,
  lowerIncGamma   : lowerIncGamma,
  powerSeries     : powerSeries,
  regIncBeta      : regIncBeta,
  regInvIncBeta   : regInvIncBeta,
  stirlingFormula : stirlingFormula,
  upperIncGamma   : upperIncGamma
}
