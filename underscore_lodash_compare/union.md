underscoreコードリーディング（union）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##unionとは


###[underscorejs.orgのunion](http://underscorejs.org/#union)

こんな説明。
>####_.union(*arrays) 
Computes the union of the passed-in arrays: the list of unique items, in order, that are present in one or more of the arrays.


```javascript

_.union([1, 2, 3], [101, 2, 1, 10], [2, 1]);
=> [1, 2, 3, 101, 10]

```
------------- 
渡されたarraysの和集合を計算します。つまり、1つ以上あるarraysの中に存在する、ユニークな値のリストを返します。


###[underscore.union](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L549)
コード的にはこのあたり。

```javascript

 // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

```


_.uniqにflattenを渡している。
_.uniqは名前の通りユニークな値のみを返す。
flattenは_.flattenでも利用されているように、複数の配列を1つの配列にまとめる。
flattenは(input, shallow, strict, startIndex)と4つの引数を持つ関数で
第一引数のargumentsは_.unionに渡されたarraysが格納されている。
shallowは階層化されている配列が渡ってきた場合にはflattenしない方がいいためtrue
strictは、配列以外の値が入っている場合などにflattenが返してくる返り値には含まないほうが良いためtrueで渡している。

つまり、渡された*arraysはflattenを用いて1つの配列に格納しなおした後、_.uniqを用いてユニークな値のみに整形し、返している。
