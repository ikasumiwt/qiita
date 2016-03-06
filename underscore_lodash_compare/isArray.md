underscoreコードリーディング（isArray）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##isArrayとは


###[underscorejs.orgのisArray](http://underscorejs.org/#isArray)

こんな説明。
>####_.isArray(object) 
Returns true if object is an Array.

```javascript
(function(){ return _.isArray(arguments); })();
=> false
_.isArray([1,2,3]);
=> true

```

------------- 
objectがArrayならtrueを返します。


###[underscore.isArray](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1205)
コード的にはこのあたり。

```javascript
  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

```

Array.isArrayが存在する場合はそちらを、存在しない場合はobjを引数にtoString.call(obj)が[object Array]の文字列に一致するかどうかを返す。
