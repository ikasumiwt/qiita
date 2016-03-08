underscoreコードリーディング（isFunction）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##isFunctionとは


###[underscorejs.orgのisFunction](http://underscorejs.org/#isFunction)

こんな説明。
>####_.isFunction(object) 
Returns true if object is a Function.

```javascript
_.isFunction(alert);
=> true

```

------------- 
objectがFunctionの場合trueを返します。

###[underscore.isFunction](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1232)
コード的にはこのあたり。

```javascript
  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }
```

