underscoreコードリーディング（indexBy）


underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##indexByとは


###[underscorejs.orgのindexBy](http://underscorejs.org/#indexBy)

こんな説明。
>####_.indexBy(list, iteratee, [context]) 
>Given a list, and an iteratee function that returns a key for each element in the list (or a property name), returns an object with an index of each item.
>Just like groupBy, but for when you know your keys are unique.



```javascript

var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
_.indexBy(stooges, 'age');
=> {
  "40": {name: 'moe', age: 40},
  "50": {name: 'larry', age: 50},
  "60": {name: 'curly', age: 60}
}

```

------------- 

listと、keyかproperty名が返されるiteratee関数を引数に、それぞれのアイテムがindexされた状態のオブジェクトが返される
groupByに似ているけれど、groupByとちがってそれぞれのkeyはユニークじゃなければならない


###[underscore.indexBy](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L414)

コード的にはこのあたり。


```javascript
  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });
```

groupByとどうようにgroup関数を用いて結果を返す。
指定されたiterateeを元にkey-value型にindexし直されて返される
