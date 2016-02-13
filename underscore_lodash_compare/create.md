underscoreコードリーディング（create）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##createとは


###[underscorejs.orgのcreate](http://underscorejs.org/#create)

こんな説明。
>####_.create(prototype, props) 
>Creates a new object with the given prototype, optionally attaching props as own properties. 
>Basically, Object.create, but without all of the property descriptor jazz.


```javascript
var moe = _.create(Stooge.prototype, {name: "Moe"});
```
------------- 
propsに付け加えられたものを独自のプロパティとしてprototypeに持つ、新しいオブジェクトを生成します
基本的にObject.createだけれども、すべてのプロパティのディスクリプタのジャズ？は存在しません。

###[underscore.create](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1058)
コード的にはこのあたり。

```javascript
  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

```

resultにbaseCreateにprototypeを渡した結果を格納する。
propsが存在する場合、_.extendOwnを用いてresultにpropsを追加する。
resultを返す。


利用している[underscore.baseCreate](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L115)は以下

```javascript
  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };
```

prototypeが_.isObjectで合致しなかった場合、空のオブジェクトを返す。
nativeCreateが存在する場合、nativeCreateを用いた結果を返す。

2つとも合致しなかった場合、Ctorのprototypeにprototypeを追加する。
resultにCtorをnewしたものを格納する。
Ctorのprototypeをnullにする。
resultを返す。

