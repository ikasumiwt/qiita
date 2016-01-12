underscoreコードリーディング（zip）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##zipとは


###[underscorejs.orgのzip](http://underscorejs.org/#zip)

こんな説明。
>####_.zip(*arrays) 
>Merges together the values of each of the arrays with the values at the corresponding position. 
>Useful when you have separate data sources that are coordinated through matching array indexes.
>If you're working with a matrix of nested arrays, _.zip.apply can transpose the matrix in a similar fashion.


```javascript

_.zip(['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]);
=> [["moe", 30, true], ["larry", 40, false], ["curly", 50, false]]

```
------------- 
それぞれのarrayの同じ位置にあるvalueをひとまとめにします。
データソースがそれぞれ分かれていて、インデックスが一致しているデータをひとまとめにしたいという時に役に立ちます。
もし、ネスト化された配列のマトリックス（行列？）での作業をしている場合には、_.zip.applyを用いることによって、同じようにマトリックスを置き換えることができます。

###[underscore.zip](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L580)
コード的にはこのあたり。

```javascript
  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

```

引数を_.unzipに受渡しているのみ。

unzipはarrayを引数に、arrayの中にネスト化されている配列を_.pluckを用いて同じindexのもの同士で分解する。（コードは以下）
_.zipの場合は引数がないので、argumentsに[array1,array2...]という形で入っているため、このままunzipに受け渡すことによって分解されたresultが返ってくる。


```javascript
  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };
```
