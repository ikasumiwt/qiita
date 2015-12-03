underscoreコードリーディング（reduce）

underscoreに詳しくないので、勉強半分でソースコードを読む。

（lodashも読もうと思っていたもののアドベントカレンダー風に1日で2つを比較して読む能力がなかったため方針変更）

##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##reduceとは


###[underscorejs.orgのreduce](http://underscorejs.org/#reduce)

こんな説明。
>####reduce_.reduce(list, iteratee, [memo], [context]) Aliases: inject, foldl 
>Also known as inject and foldl,
>reduce boils down a list of values into a single value.
>Memo is the initial state of the reduction, and each successive step of it should be returned by iteratee.
>The iteratee is passed four arguments: the memo,then the value and index (or key) of the iteration, and finally a reference to the entire list.

>If no memo is passed to the initial invocation of reduce, the iteratee is not invoked on the first element of the list. 
>The first element is instead passed as the memo in the invocation of the iteratee on the next element in the list.

```javascript
var sum = _.reduce([1, 2, 3], function(memo, num){ return memo + num; }, 0);
=> 6
```

injectやfoldlにエイリアスが張られている。
reduceはリストの値を１つの値に集約して返してくれる関数である。
Memoはreductionの初期状態である（？） //初期値をiterateeに持っていけるってこと？ そして各ステップ(//たぶんiterateeを回すごと)において、iterateeによってreturnされるべきだ
iterateeには4つの値が渡される（//たぶんいつもわたしている3つ＋memo?）iterateeはリストの最初のelementの場合は呼びだされません。
最初のelementは単にpassするのではなく、memoとして次のelementのiterateeで渡されます。

つまり
・reduceはarray/objectを1つの値にまとめて返却してくれる関数
・returnする値の初期値はmemoとして渡せる
・最初の値に対してiterateeは適応されないが、最初の値はmemoとして利用される

ということ？

//？？？　contextはどこにきえた


なので

こうすると

```javascript
'use strict';
var _ = require( "underscore" );
var arr = [ 1, 3, 5 ];

var memo = 5;

//arr = { "a": 1, "b": 2, "c": 3 };
var result = _.reduce( arr, function( _memo, num ) {

    console.log( "memo:" + memo );
    console.log( "_memo:" + _memo );
    console.log( "num:" + num );

    console.log( "--------------------" );

    _memo = _memo + num;
    return _memo;
}, memo );

console.log( result );
```

こうなる


```
node reduce.js
memo:5
_memo:5
num:1
--------------------
memo:5
_memo:6
num:3
--------------------
memo:5
_memo:9
num:5
--------------------
14
```

