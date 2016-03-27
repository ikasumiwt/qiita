underscoreコードリーディング（mixin）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##mixinとは


###[underscorejs.orgのmixin](http://underscorejs.org/#mixin)

こんな説明。
>####_.mixin(object) 
>Allows you to extend Underscore with your own utility functions. 
>Pass a hash of {name: function} definitions to have your functions added to the Underscore object, as well as the OOP wrapper.


```javascript
_.mixin({
  capitalize: function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  }
});
_("fabio").capitalize();
=> "Fabio"
```

------------- 
Underscoreに貴方自身が使いたい関数を追加することを許可します。
OOPのラッパーと同様に、{name:function}の形で定義されたハッシュを渡すことで、あなたの追加したい関数をUnderscoreのobjectに追加できます。


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

_.eachを利用する。
第一引数は_.functionsにobjを渡したもの、第二引数にnameを引数とした関数。
この関数の中身は以下

