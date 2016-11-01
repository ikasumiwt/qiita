underscoreコードリーディング（isUndefined）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##isUndefinedとは


###[underscorejs.orgのisUndefined](http://underscorejs.org/#isUndefined)

こんな説明。
>####_.isUndefined(value) 
Returns true if value is undefined.

```javascript
_.isUndefined(window.missingVariable);
=> true
```

------------- 
valueがundefinedだった場合にtrueを返します

###[underscore.isUndefined](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1260)
コード的にはこのあたり。

```javascript
  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

```

objとvoid 0(undefined)の比較の結果を返す。
