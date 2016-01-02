underscoreコードリーディング（without）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##withoutとは


###[underscorejs.orgのwithout](http://underscorejs.org/#without)

こんな説明。
>####_.without(array, *values) 
Returns a copy of the array with all instances of the values removed.

```javascript

_.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
=> [2, 3, 4]

```
------------- 

*valuesを除いたarrayのコピーを返す。


###[underscore.where](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L514)
コード的にはこのあたり。

```javascript
 // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };
```

[_.difference](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L573)を用いて配列の差分を出す。
[_.difference](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L573)は2つ配列（引数）から、その差分の配列を返す関数。

array以外の引数はargumentsに格納されるので、それをsliceを用いて配列に直し、渡す。


