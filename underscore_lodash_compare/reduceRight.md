underscoreコードリーディング（reduceRight）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##reduceRightとは


###[underscorejs.orgのreduce](http://underscorejs.org/#reduceRight)

こんな説明。
>####_.reduceRight(list, iteratee, memo, [context]) Alias: foldr 
>The right-associative version of reduce. 
>Delegates to the JavaScript 1.8 version of reduceRight, if it exists.
>Foldr is not as useful in JavaScript as it would be in a language with lazy evaluation.

```javascript
var list = [[0, 1], [2, 3], [4, 5]];
var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
=> [4, 5, 2, 3, 0, 1]
```

foldrにエイリアスが張られている。
reduceの右からバージョン.
JavaScriptバージョン1.8からは[reduceRightは存在している]（https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight）
ので、その場合はそこに委譲している。
Foldr はJavaScriptではあまり有用じゃないかんじ（？）

つまり
・reduceの右から行うパターン

なので

こうすると

```javascript
'use strict';
var _ = require( "underscore" );
var arr = [ 1, 3, 5 ];

var memo = 5;

var result = _.reduce( arr, function( _memo, num ) {

    console.log( num );
    return _memo;
}, memo );

//-> 1 3 5

```

となるのに対して

```javascript
'use strict';
var _ = require( "underscore" );
var arr = [ 1, 3, 5 ];

var memo = 5;

var result = _.reduceRight( arr, function( _memo, num ) {

    console.log( _ memo );
    return _memo;
}, memo );

//-> 5 3 1

```

となる


###[underscore.reduce](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L208)
コード的にはこのあたり。

```javascript
_.reduceRight = _.foldr = createReduce(-1);
```

reduceと同じ関数で処理している（[ここ](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L178)）

```javascript
  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }
```

1/-1で、reduce/reduceRightで処理を分けている


```
var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
```


のあたりは他のcollection系の関数と同様に、arrayだったらfalse,objectだったらkeyの配列を返し、その配列の長さを代入、
indexはlength -1  

```
if (arguments.length < 3) {
    memo = obj[keys ? keys[index] : index];
    index += dir;
}
```

この部分は、配列の引数が2以下だった場合(つまりmemo = undefinedだった場合)、初期値のもととなるmemoが存在しないため、これを決定する。

配列だった場合はindexを、配列じゃなかった場合はindex[0]を初期値にする
初期値決定後はindex += dirする（reduceの場合はindex++）

その後、iteratorに引き継いで回す


