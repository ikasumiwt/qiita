underscoreコードリーディング（isNull）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##isNullとは


###[underscorejs.orgのisNull](http://underscorejs.org/#isNull)

こんな説明。
>####_.isNull(object) 
Returns true if the value of object is null.


```javascript
_.isNull(null);
=> true
_.isNull(undefined);
=> false
```

------------- 
objectがnullだった場合にtrueを返します。

###[underscore.isNull](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1255)
コード的にはこのあたり。

```javascript
  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

```

objとnullとの比較の結果を返す。
