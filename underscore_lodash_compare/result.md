underscoreコードリーディング（result）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##resultとは


###[underscorejs.orgのresult](http://underscorejs.org/#result)

こんな説明。
>####_.result(object, property, [defaultValue]) 
> If the value of the named property is a function then invoke it with the object as context; otherwise, return it.
> If a default value is provided and the property doesn't exist or is undefined then the default will be returned.
> If defaultValue is a function its result will be returned.


```javascript
var object = {cheese: 'crumpets', stuff: function(){ return 'nonsense'; }};
_.result(object, 'cheese');
=> "crumpets"
_.result(object, 'stuff');
=> "nonsense"
_.result(object, 'meat', 'ham');
=> "ham"
```

------------- 


###[underscore.result](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1363)
コード的にはこのあたり。

```javascript

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

```

引数はobject,property,fallbackの３つ。
変数valueにobjectがnullの場合はvoid 0(undefined)を、そうでない場合はobject[property]を入れる。
valueが void 0だった場合、valueにfallbackを代入する。
_.isFunctionにvalueを渡した結果が関数だった場合、objectを渡してvalueをcallしたものを返し、そうでない場合はvalueを返す。
