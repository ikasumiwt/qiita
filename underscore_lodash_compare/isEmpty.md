underscoreコードリーディング（isEmpty）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##isEmptyとは


###[underscorejs.orgのisEmpty](http://underscorejs.org/#isEmpty)

こんな説明。
>####_.isEmpty(object) 
>Returns true if an enumerable object contains no values (no enumerable own-properties). 
>For strings and array-like objects _.isEmpty checks if the length property is 0.

```javascript
_.isEmpty([1, 2, 3]);
=> false
_.isEmpty({});
=> true
```

------------- 
objectがno value（propertyを含む）だった場合にtrueを返します。
stringやarray likeなobjectの場合、_.isEmptyはlengthが0かどうかをチェックします。

###[underscore.isEmpty](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1192)
コード的にはこのあたり。

```javascript
  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };
```

引数はobj。
objがnullの場合、trueを返す。
objがisArrayLikeがtrueかつ _.isArrayまたは_.isStringまたは_.isArgumentsに合致する場合はobj.lengthが0かどうかの真偽値を返す。
それらに該当しなかった場合、_.keys(obj)のlengthが0かどうかの真偽値を返す。
