underscoreとlodashの比較(map)
underscoreもlodashも詳しくないので、勉強半分でソースコードを読む。

##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)

[lodash.js(v3.10.0)](https://github.com/lodash/lodash/tree/3.10.0-npm-packages)


##mapとは

今ある配列を元に新しい配列を作り直す関数。

配列の場合は

```javascript
'use strict';

var _ = require( "underscore" );

var arr = [ 1, 2, 3 ];

var hoge = _.map( arr, function( element ) {
    return element * 3;
});

console.log( hoge ); //[ 3, 6, 9 ]
```



連想配列の場合は

```javascript
arr = { "a": 1, "b": 2, "c": 3 };
var hoge = _.map( arr, function( element, key ) {

    return element * 3;
});

console.log( hoge ); //[ 3, 6, 9 ]
```

lodashも同様。


##[underscore.map](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L165)

```javascript
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };
```

_.collectも_.mapと同様。

foreach同様isArrayLikeや_.keysを用いてkeysの判定。

objがarrayだった場合は

```javascript
false  //isArrayLike(obj) -> trueのため
3 // obj.length
[ , , ] //Array(3)
```
の形で変数が生成されて

```javascript
[ "a","b","c" ]  //isArrayLike(obj) -> falseのため_.keys(obj)
3 // keys.length
[ , , ] // Array(3)
```

というかたちで処理される

その後、普通のfor文でのループ
currentLeyは
配列の場合はkeys -> falseのため index,
連想配列の場合はkeys[index] //ex)a,b,c

となって、それをiterateeで処理したものを返り値resultsとしてreturnする



##[lodash.map](https://github.com/lodash/lodash/blob/3.10.0-npm-packages/lodash.map/index.js)

```javascript
function map(collection, iteratee, thisArg) {
  var func = isArray(collection) ? arrayMap : baseMap;
  iteratee = baseCallback(iteratee, thisArg, 3);
  return func(collection, iteratee);
}

```


lodashはまた明日に（ｒｙ
