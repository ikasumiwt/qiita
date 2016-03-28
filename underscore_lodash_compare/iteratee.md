underscoreコードリーディング（iteratee）

underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##iterateeとは


###[underscorejs.orgのiteratee](http://underscorejs.org/#iteratee)

こんな説明。
>####_.iteratee(value, [context]) 
>Generates a callback that can be applied to each element in a collection. 
>_.iteratee supports a number of shorthand syntaxes for common callback use cases.
>Depending value's type _.iteratee will return:


```javascript
// No value
_.iteratee();
=> _.identity()

// Function
_.iteratee(function(n) { return n * 2; });
=> function(n) { return n * 2; }

// Object
_.iteratee({firstName: 'Chelsea'});
=> _.matcher({firstName: 'Chelsea'});

// Anything else
_.iteratee('firstName');
=> _.property('firstName');

```

The following Underscore methods transform their predicates through _.iteratee: countBy, every, filter, find, findIndex, findKey, findLastIndex, groupBy, indexBy, map, mapObject, max, min, partition, reject, some, sortBy, sortedIndex, and uniq

------------- 
>Generates a callback that can be applied to each element in a collection. 
>_.iteratee supports a number of shorthand syntaxes for common callback use cases.
>Depending value's type _.iteratee will return:


次のUnderscoreのメソッドは_.iterateeを用いることによって変形されます。
```
countBy, every, filter, find, findIndex, findKey, findLastIndex, groupBy, indexBy, map, mapObject, max, min, partition, reject, some, sortBy, sortedIndex, uniq
```

###[underscore.iteratee](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L93)
コード的にはこのあたり。

```javascript
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };
```

