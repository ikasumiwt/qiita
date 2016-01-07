underscoreコードリーディング（unzip）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##unzipとは


###[underscorejs.orgのunzip](http://underscorejs.org/#unzip)

こんな説明。
>####_.unzip(*arrays) 
>The opposite of zip.
>Given a number of arrays, returns a series of new arrays, the first of which contains all of the first elements in the input arrays, the second of which contains all of the second elements, and so on.
>Use with apply to pass in an array of arrays.

```javascript

_.unzip([['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]])
=> ["moe", 30, true], ["larry", 40, false], ["curly", 50, false]

```
------------- 
zipの反対。
arrayの数を与える
新しい配列のシリーズを返す
最初の配列はarraysの


###[underscore.unzip](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L586)
コード的にはこのあたり。

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
arrayを引数に、arrayの中にネスト化されている配列を_.pluckを用いて同じindexのもの同士で分解する。
