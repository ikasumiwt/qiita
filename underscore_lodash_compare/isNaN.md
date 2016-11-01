underscoreコードリーディング（isNaN）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##isNaNとは


###[underscorejs.orgのisNaN](http://underscorejs.org/#isNaN)

こんな説明。
>####_.isNaN(object) 
>Returns true if object is NaN.
>Note: this is not the same as the native isNaN function, which will also return true for many other not-number values, such as undefined.


```javascript
_.isNaN(NaN);
=> true
isNaN(undefined);
=> true
_.isNaN(undefined);
=> false
```

------------- 
objectがNaNだった場合にtrueを返します。
注記：nativeのisNaN関数はundefinedなどのnot-numberな値だった場合にもtrueを返しますが、_.isNaNはそれとは挙動が違います。

###[underscore.isNaN](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1245)
コード的にはこのあたり。

```javascript
  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

```

isNumberに合致するかつ、objが+objと合致しない場合にtrueを返します。
