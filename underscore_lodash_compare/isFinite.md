underscoreコードリーディング（isFinite）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##isFiniteとは


###[underscorejs.orgのisFinite](http://underscorejs.org/#isFinite)

こんな説明。
>####_.isFinite(object) 
Returns true if object is a finite Number.

```javascript
_.isFinite(-101);
=> true

_.isFinite(-Infinity);
=> false
```

------------- 
objectが有限数だった場合にtrueを返します

###[underscore.isFinite](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1240)
コード的にはこのあたり。

```javascript
 // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

```

トップレベル関数の[isFinite](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/isFinite)と
[isNaN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/isNaN)を用い、両方がtrueが返ってきた場合のみtrueを返す。
