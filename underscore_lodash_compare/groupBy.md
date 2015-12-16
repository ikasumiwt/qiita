underscoreコードリーディング（groupBy）


underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##groupByとは


###[underscorejs.orgのmax](http://underscorejs.org/#groupBy)

こんな説明。
>####_.groupBy(list, iteratee, [context]) 
>Splits a collection into sets, grouped by the result of running each value through iteratee. 
>If iteratee is a string instead of a function, groups by the property named by iteratee on each of the values.


```javascript

_.groupBy([1.3, 2.1, 2.4], function(num){ return Math.floor(num); });
=> {1: [1.3], 2: [2.1, 2.4]}

_.groupBy(['one', 'two', 'three'], 'length');
=> {3: ["one", "two"], 5: ["three"]}
```

------------- 

###[underscore.groupBy](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L408)

コード的にはこのあたり。

```javascript
  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });
```


groupは以下

```javascript
// An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };
```
