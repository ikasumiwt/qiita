underscoreコードリーディング（memoize）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##とは


###[underscorejs.orgのmemoize](http://underscorejs.org/#memoize)

こんな説明。
>####_.memoize(function, [hashFunction]) 
>Memoizes a given function by caching the computed result. 
>Useful for speeding up slow-running computations. 
>If passed an optional hashFunction, it will be used to compute the hash key for storing the result, based on the arguments to the original function.
>The default hashFunction just uses the first argument to the memoized function as the key.
>The cache of memoized values is available as the cache property on the returned function.

```javascript

var fibonacci = _.memoize(function(n) {
  return n < 2 ? n: fibonacci(n - 1) + fibonacci(n - 2);
});

```
------------- 
memoizeは計算した結果をキャッシュすることによって与えられた関数をメモしておきます。
実行速度の遅い関数を高速化するのに使えます。
hash keyを計算するために使用される、hashFunctionをオプションで渡すと、元の関数の引数に基づいて利用されます。
デフォルトのhashFunctionはメモ化された関数のkeyとして、最初の引数を利用します。
メモされた値のキャッシュは、返される関数のcache propertyとして利用できます。


###[underscore.memoize](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L751)
コード的にはこのあたり。

```javascript
  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };
```

funcとhasherを引数にとる。
memoizeを引数keyの関数として定義する。
memoize.cacheをcacheに格納する。
addressにstringとして hasherが存在したらhasherにthisとargumentsをもとにapplyする。そうでない場合はkeyを格納する
chacheがaddressを持っていた場合、cache[address]にfunc.applyした結果を格納する。その後、cache[address]ｍを返却する。
