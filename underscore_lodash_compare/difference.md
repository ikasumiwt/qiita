underscoreコードリーディング（difference）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##differenceとは


###[underscorejs.orgのdifference](http://underscorejs.org/#difference)

こんな説明。
>####_.difference(array, *others) 
Similar to without, but returns the values from array that are not present in the other arrays.

```javascript

_.difference([1, 2, 3, 4, 5], [5, 2, 10]);
=> [1, 3, 4]

```

------------- 
withoutに似ているが、arrayの中でothersの配列に入っていない値を返します。



###[underscore.difference](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L571)
コード的にはこのあたり。

```javascript

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

```


第一引数のarray以外の値をflattenを用いてrestという変数に格納する。
_.filterをarrayに用いる。filterする条件は、arrayの値valueがrestに含まれていないもののみにフィルタリングする。
これで、例に挙げられているとおりarrayの中でothers(rest)に含まれていないもののみが抽出できる。
