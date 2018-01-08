# README #

Statistical functions for Javascript.

SampleStat
-------------------------------------
The `SampleStat` class provides basic statistics from an array of sampled values.

    var SampleStat = require('essy-stats').SampleStat;
    var sample     = new dists.SampleStat([1, 2, 3, 4, 5]);

    var mean   = sample.mean();   // 3
    var median = sample.median(); // 3

#### SampleStat(values)
Create a new instance from an array of numerical `values`.

#### kurtosis()
Returns kurtosis of sample values.

#### max()
Returns maximum value in samples.

#### mean()
Returns mean of sample values.

#### median()
Returns median of sample values.

#### percentile(x)
Returns specified percentile where `x` is a value in the sample set range.

#### quantile(p)
Returns specified quantile, where `p` is in range [0, 1].

#### range()
Returns range of sample values.

#### skew()
Returns skewness of sample values.

#### stdDev()
Returns standard deviation of sample values.

#### variance()
Returns variance of sample values.
