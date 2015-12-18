underscoreコードリーディング（sortBy）


underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##sortByとは


###[underscorejs.orgのsoryBy](http://underscorejs.org/#sortBy)

こんな説明。
>####_.sortBy(list, iteratee, [context]) 
Returns a (stably) sorted copy of list, ranked in ascending order by the results of running each value through iteratee.
>iteratee may also be the string name of the property to sort by (eg. length).


```javascript
_.sortBy([1, 2, 3, 4, 5, 6], function(num){ return Math.sin(num); });
=> [5, 4, 6, 3, 1, 2]

var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
_.sortBy(stooges, 'name');
=> [{name: 'curly', age: 60}, {name: 'larry', age: 50}, {name: 'moe', age: 40}];
```

------------- 

ソート済みのlistをコピーを返す関数。ソートのランク付けには、各valueに対してiterateeを回したものを照準に並べ替えたものをresultとする。
iterateeはlengthのように、sortのプロパティ名でも問題無いです。

###[underscore.sortBy](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L374)

コード的にはこのあたり。

```javascript
 // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };
```


