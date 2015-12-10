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


つまり

```javascript
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function( cb(predicate) ) {
      return function() {
        return !predicate.apply(this, arguments);
    }, context);
  };
```

な感じで（もはやわからない）
cbは

```javascript

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };

```


となっている。
[_.identity](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1282)はvalueを引数にvalueを返してくれる関数

```javascript
  _.identity = function(value) {
    return value;
  };
```

（->つまりnullの場合はnullを返されるということ）

---------------------

[_.isFunction](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1234)はFunctionかどうかを判定してくれる
(Safari8とかIE11とかだと動かない・・・？[Int8Array](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Int8Array)がobjectとして存在しなかった場合などのif文の中にある)

(->functionだった場合はoptimizeCb(value, context, argCount);が返される)


------------------------------

[_.isObject]https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1212)で判定して、Objectだった場合は _.matcher(value)が返される。_.matcherは前述のとおり。

------------------------------

どれにも合致しなかったらreturn _.property(value);される
[_.property](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1295)は[property](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L125)で、nullでなければobj[key]を返す（nullチェックは先にされているので確実にobj[key]が返される）




基本的にvalueはfunctionが入ってくるはずなので、optimizeCb(value, context, argCount);が返却される。


```javascript
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function( optimizeCb(value, context, argCount) ) {
      return function() {
        return !predicate.apply(this, arguments);
    }, context);
  };
```

こうなって

```javascript
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function( optimizeCb(value, context, argCount) ) {
      return function() {
        return !predicate.apply(this, arguments);
    }, context);
  };
```

[optimizeCb](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L63)はcb(value)で渡されている(value=function(num){ return num % 2 == 0; }的な形)ので、引数が一つ引数がつなので

```javascript
 if (context === void 0) return func;
```
に引っかかりそのままfunctionが返される。

つまり

```javascript
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function( predicate ) {
      return function() {
        return !predicate.apply(this, arguments);
    }, context);
  };
```

となって

_.filterを用いてフィルタリングしていて、フィルタリングされる条件はpredicateが実行されて引っかかったもの**以外**が返されていることがわかる。（たぶん）

