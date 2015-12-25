underscoreコードリーディング（partition）


underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##partitionとは


###[underscorejs.orgのsize](http://underscorejs.org/#partition)

こんな説明。
>####_.partition(array, predicate) 
Split array into two arrays: one whose elements all satisfy predicate and one whose elements all do not satisfy predicate.



```javascript

_.partition([0, 1, 2, 3, 4, 5], isOdd);
=> [[1, 3, 5], [0, 2, 4]]

```

------------- 

配列を2つの配列に分割します。
1つはpredicateで指定されたものをすべて満たす配列、もう1つはそれをすべて満たさない配列です。

###[underscore.partition](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L439)

コード的にはこのあたり。


```javascript

 // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };



```

