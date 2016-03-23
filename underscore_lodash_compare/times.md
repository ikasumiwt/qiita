underscoreコードリーディング（times）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##timesとは


###[underscorejs.orgのtimes](http://underscorejs.org/#times)

こんな説明。
>####_.times(n, iteratee, [context]) 
>Invokes the given iteratee function n times. 
>Each invocation of iteratee is called with an index argument. 
>Produces an array of the returned values. 
>Note: this example uses the chaining syntax.



```javascript
_(3).times(function(n){ genie.grantWishNumber(n); });
```

------------- 
与えられたiterateeをn回数繰り返し呼び出します。
それぞれのiterateeは、indexのargumentと一緒に呼び出されます。
返される値を元にarrayが作られます。
注記：この例はメソッドチェーンを使っています。

###[underscore.times](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1313)
コード的にはこのあたり。

```javascript
 // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

```

accumにnの個数分の空の配列を定義する。
iterateeにoptimizeCbの結果を格納する。


for文でi=0からnまで1ずつ回す。iterateeにiを代入し、結果をacuumのi番目に代入する。
その後、accumを返す。

