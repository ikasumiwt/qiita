underscoreコードリーディング（filter）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##filterとは


###[underscorejs.orgのfilter](http://underscorejs.org/#filter)

こんな説明。
>####_.filter(list, predicate, [context]) Alias: select 
Looks through each value in the list, returning an array of all the values that pass a truth test (predicate).

```javascript
var evens = _.filter([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
=> [2, 4, 6]
```

------------- 

selectにエイリアスが張られている。
listのすべての値に対してテストをし、そのテストを通ったもので形成されたArrayを返します。

[Array.prototype.filter](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)も存在する（IE9以上で利用可なので、IE8サポートの場合などはまだこっちを使うといいかも。）

###[underscore.filter](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L223)
コード的にはこのあたり。

```javascript
_.filter = _.select = function(obj, predicate, context) {
  var results = [];
  predicate = cb(predicate, context);
  _.each(obj, function(value, index, list) {
    if (predicate(value, index, list)) results.push(value);
  });
  return results;
};

```

返り値用のArray resultsを作成。
処理自体は_.each(_.forEach)に処理を任せていて、_.eachで処理をする中で条件に引っかかったものに関してだけresultsに値をpushしている。

その結果を最終的にreturnしている

_.eachを内部で実行しているので、_.filterもArray/objectの両方で利用できる。

object(連想配列)で_.filterを実行した場合は、valueが **Array** で返ってくるので、その点だけ注意。

こんな感じ

```javascript:filter.js
'use strict';
var _ = require( "underscore" );

var arr = { "a": 1, "b": 2, "c": 3 };

var hoge = _.filter( arr, function( num, key ) {
    return num >= 2;
});

console.log( hoge );
```

```
$node filter.js
[ 2, 3 ]
```
