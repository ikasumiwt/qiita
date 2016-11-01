underscoreコードリーディング（once）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##onceとは


###[underscorejs.orgのonce](http://underscorejs.org/#once)

こんな説明。
>####_.once(function) 
>Creates a version of the function that can only be called one time. 
>Repeated calls to the modified function will have no effect, returning the value from the original call. 
>Useful for initialization functions, instead of having to set a boolean flag and then check it later.


```javascript
var initialize = _.once(createApplication);
initialize();
initialize();
// Application is only created once.

```
------------- 
一回しか呼び出すことの出来ない関数を生成します。
関数を複数回呼び出しても、その関数はなんの効果もないように/元の関数の値が返らないように修正されます。
booleanのフラグを使って後でチェックするような、イニシャライズするような関数にとって役に立ちます。



###[underscore.once](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L897)
コード的にはこのあたり。

```javascript
  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

```

_.partialを用いて、_.beforeに2を与える。
_.beforeは与えられた回数未満の回数しか関数を実行できないとするもの。
（前置インクリメントなので、2を渡すと2回目には使えない。）

