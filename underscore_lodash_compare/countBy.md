underscoreコードリーディング（countBy）


underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##countByとは


###[underscorejs.orgのcountBy](http://underscorejs.org/#countBy)

こんな説明。
>####_.countBy(list, iteratee, [context]) 
>Sorts a list into groups and returns a count for the number of objects in each group.
>Similar to groupBy, but instead of returning a list of values, returns a count for the number of values in that group.


```javascript

_.countBy([1, 2, 3, 4, 5], function(num) {
  return num % 2 == 0 ? 'even': 'odd';
});
=> {odd: 3, even: 2}

```

------------- 
listをソートし、listの中にobjectがいくつあるのかをカウントし、それを返す。
groupByとにているが、groupByはlistの値を返すのに対して、countByはそれらの値がいくつあるのかを返す

###[underscore.countBy](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L418)

コード的にはこのあたり。


```javascript
  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });
```

groupByと同様にgroup関数を用いて結果を返す。
groupByと同じように、_.hasを用いて結果が既に存在する場合はそのカウントを+1し、初めての場合は1を代入する
