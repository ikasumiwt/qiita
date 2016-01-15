underscoreコードリーディング（findIndex）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##findIndexとは


###[underscorejs.orgのfindIndex](http://underscorejs.org/#findIndex)

こんな説明。
>####_.findIndex(array, predicate, [context]) 
Similar to _.indexOf, returns the first index where the predicate truth test passes;
otherwise returns -1.

```javascript

_.findIndex([4, 6, 8, 12], isPrime);
=> -1 // not found
_.findIndex([4, 6, 7, 12], isPrime);
=> 2

```
------------- 
_.indexOfと似ている。predicateと一致する最初の箇所のindexを返却する。
もしない場合は-1を返す。


###[underscore.findIndex](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L626)
コード的にはこのあたり。

```javascript

 // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  
```

createPredicateIndexFinderに1を渡しているのみ


[createPredicateIndexFinder](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L613)は以下

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


dir=1なのでこうなる

```javascript

function(array, predicate, context) {
  predicate = cb(predicate, context);
  var length = getLength(array);
  var index =  0 ;
  for (; 0 < length; index++) {
    if (predicate(array[index], index, array)) return index;
  }
  return -1;
};

```

arrayのlength分だけforぶんを回す。
predicateに合致した場合はindexを返す。
for分を回しても返り値がなかった場合、-1を返す。
