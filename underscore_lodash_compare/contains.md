underscoreコードリーディング（contains）


underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##containsとは


###[underscorejs.orgのcontains](http://underscorejs.org/#contains)

こんな説明。
>####_.contains(list, value, [fromIndex]) Alias: includes 
>Returns true if the value is present in the list.
>Uses indexOf internally, if list is an Array.
>Use fromIndex to start your search at a given index.

```javascript
_.contains([1, 2, 3], 3);
=> true
```

------------- 
_.includesにエイリアスが張られている

listの中に第二引数で指定したvalueが存在する場合trueを返す
listがArrayの場合は内部ではindexOfを利用します。
fromIndexを指定することによって開始位置を指定して検索することができます。


つまり


```javascript
'use strict';

var _ = require( "underscore" );

console.log( _.contains( [ 1, 2, 3, 4, 5 ], 2 ) ); 
//-> true
console.log( _.contains( [ 1, 2, 3, 4, 5 ], 2, 3 ) );
//-> false
```

となる


###[underscore.contains](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L263)

コード的にはこのあたり。

```javascript

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };
```


aliasはinclude/includes両方に張られている(説明とはズレが有る)


objがArrayじゃなかった場合、obj = _.valuesとなる
fromIndexがnumberじゃなかった場合、またはguardが存在する場合、fromIndexは0となる
_.indexOfが0以上の場合true/そうでない場合はfalseが返される


