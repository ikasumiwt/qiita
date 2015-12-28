underscoreコードリーディング（initial）


underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##initialとは



###[underscorejs.orgのinitial](http://underscorejs.org/#initial)

こんな説明。
>####_.initial(array, [n]) 
>Returns everything but the last entry of the array. 
>Especially useful on the arguments object. 
>Pass n to exclude the last n elements from the result.



```javascript

_.initial([5, 4, 3, 2, 1]);
=> [5, 4, 3, 2]

```

------------- 



###[underscore.initial](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L462)

コード的にはこのあたり。


```javascript
  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

```

