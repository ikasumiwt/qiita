underscoreコードリーディング（findWhere）



underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##rejectとは


###[underscorejs.orgのreject](http://underscorejs.org/#reject)

こんな説明。
>####__.reject(list, predicate, [context]) 
>Returns the values in list without the elements that the truth test (predicate) passes.
>The opposite of filter.

```javascript
var odds = _.reject([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
=> [1, 3, 5]
```

------------- 
エイリアスは特になし。

predicateのtestに通ったもの**以外**の値をlistにして返す
filterの反対。


###[underscore.findWhere](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L232)

コード的にはこのあたり。

```javascript
 // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };


```

_.filterと_.negateを用いて、マッチしたもののうち先頭のものを返却する。


。
_.negateはpredicateを通らなかった値のみを返却するもの

[underscore.negate](http://underscorejs.org/#negate)

```javascript
_.negate(predicate) 
Returns a new negated version of the predicate function.

var isFalsy = _.negate(Boolean);
_.find([-2, -1, 0, 1, 2], isFalsy);
=> 0
```

[_.negate](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L856)

```javascript
// Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

```

