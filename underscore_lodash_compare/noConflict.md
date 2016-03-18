underscoreコードリーディング（noConflict）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##noConflictとは


###[underscorejs.orgのnoConflict](http://underscorejs.org/#noConflict)

こんな説明。
>####_.noConflict() 
>Give control of the _ variable back to its previous owner.　
>Returns a reference to the Underscore object.

```javascript
var underscore = _.noConflict();
```

------------- 
_の変数のコントロールを以前のオーナーに与える。?
underscoreのobjectの参照を返す。

###[underscore.noConflict](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1274)
コード的にはこのあたり。

```javascript

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

```

root._にpreviousUnderscoreを代入する。
その後、thisを返す。
