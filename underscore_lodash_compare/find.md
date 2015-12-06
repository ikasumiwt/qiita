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

detectにエイリアスが張られている。


つまり

なので

こうすると

```javascript
'use strict';
var _ = require( "underscore" );
var arr = [ 1, 3, 5 ];


```

となる


###[underscore.reduce](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L211)
コード的にはこのあたり。

```javascript
_.reduceRight = _.foldr = createReduce(-1);
```

reduceと同じ関数で処理している（[ここ](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L211)）

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

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

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

1/-1で、reduce/reduceRightで処理を分けている


```javascript
var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
```


配列だった場合はindexを、配列じゃなかった場合はindex[0]を初期値にする
初期値決定後はindex += dirする（reduceRightの場合はindex--）

その後、iteratorに引き継いで回す


