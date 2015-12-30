underscoreコードリーディング（rest）


underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##restとは



###[underscorejs.orgのrest](http://underscorejs.org/#rest)

こんな説明。
>####_.rest(array, [index]) Alias: tail, drop 
Returns the rest of the elements in an array. Pass an index to return the values of the array from that index onward.


```javascript
_.rest([5, 4, 3, 2, 1]);
=> [4, 3, 2, 1]
```

------------- 

配列の残りの要素を返す。
indexを渡した場合は、index以降の値を返します。


###[underscore.rest](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L477)

コードはこのあたり。


```javascript
 // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

```

_.tail,_.dropもエイリアスを張られている。
sliceを用いてarrayのn番目以降を返す。
