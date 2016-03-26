underscoreコードリーディング（mixin）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##mixinとは


###[underscorejs.orgのmixin](http://underscorejs.org/#mixin)

こんな説明。
>####


```javascript

```

------------- 


###[underscore.mixin](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1490)
コード的にはこのあたり。

```javascript

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

```

