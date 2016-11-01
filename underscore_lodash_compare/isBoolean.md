underscoreコードリーディング（isBoolean）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##isBooleanとは


###[underscorejs.orgのisBoolean](http://underscorejs.org/#isBoolean)

こんな説明。
>####_.isBoolean(object) 
Returns true if object is either true or false.

```javascript
_.isBoolean(null);
=> false

```

------------- 
objectがtrueもしくはfalseだった場合のみtrueを返します。

###[underscore.isBoolean](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1250)
コード的にはこのあたり。

```javascript

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };
```

obj自体がtrueかfalseに合致する、もしくはtoStringしたものが[object Boolean]に合致した場合にtrueを返す。
