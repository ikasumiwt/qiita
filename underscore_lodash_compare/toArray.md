underscoreコードリーディング（toArray）


underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##toArrayとは


###[underscorejs.orgのtoArray](http://underscorejs.org/#toArray)

こんな説明。
>####_.toArray(list) 
>Creates a real Array from the list (anything that can be iterated over).
>Useful for transmuting the arguments object.

```javascript

(function(){ return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
=> [2, 3, 4]

```

------------- 

listから配列を作成する（iterateできるものであれば）
objectを配列にするのに便利な関数です


###[underscore.toArray](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L425)

コード的にはこのあたり。


```javascript
  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };


```

objがない場合はからの配列を返す。
objが配列の場合は、sliceを用いて配列を生成して返す（copyではない）
objが連想配列(object)の場合は_.mapを用いてvalueの配列を生成して返す。
それ以外の場合は_.valuesを用いて、その結果を返す。

