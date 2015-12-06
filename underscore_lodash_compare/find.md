underscoreコードリーディング（find）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##findとは


###[underscorejs.orgのreduce](http://underscorejs.org/#find)

こんな説明。
>####_.find(list, predicate, [context]) Alias: detect 
>Looks through each value in the list, returning the first one that passes a truth test (predicate), or undefined if no value passes the test.
>The function returns as soon as it finds an acceptable element, and doesn't traverse the entire list.




```javascript
var even = _.find([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
=> 2

```

------------- 


detectにエイリアスが張られている。
リストの各値を見ていて手、最初に条件に一致した値のを返す。もし条件に一致しなかった場合はundefinedを返す。

この関数は、条件に一致する値を見つけたらリターンするため、その時はlist全体を探査することはありません。


>The function returns as soon as it finds an acceptable element, and doesn't traverse the entire list.
↑の訳文はさらに↑に書いたけど、
ここは例からもわかるとおり、例は条件に一致する値が2/4/6とあるけれど、2が一致した時点で値を返却するということ。



```javascript
'use strict';
var _ = require( "underscore" );
var arr = [ 1, 3, 5 ];

var hoge = _.find( arr, function( num ) {

    return num * num === 9;
});

console.log( hoge ); // -> 3

```

となる


###[underscore.reduce](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L211)
コード的にはこのあたり。

```javascript
  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };
```


Arrayだった場合は_.findIndexで、Objectだった場合は_.findKeyで処理をしている

```javascript
  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
```

中身は以下

```javascript
    // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

```

引数にarray,predicate(function),contextを持つ関数を返す。dir=1なので返される関数を書き換えると以下な形。

```javascript

function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index =  0;
      for (; index >= 0 && index < length; index ++) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };

```

_.findは条件に合致した最初の関数を返すので、合致した場合はindex,合致するものがなければ-1を返すことになる。


---------------------

_.findKeyは以下。

```javascript

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

```

こちらは、条件に合致するものがなかった場合は何も返さない(undefined)事になる（はず？）


どちらにせよ
```javascript

if (key !== void 0 && key !== -1) return obj[key];
```
最終的に、keyがvoid 0 / -1 じゃないときにのみobj[key]を返すため、条件に合致しない場合はundefinedとなる
