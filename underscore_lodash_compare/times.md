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

