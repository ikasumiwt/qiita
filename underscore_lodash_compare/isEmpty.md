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


###[underscore.isEmpty](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1305)
コード的にはこのあたり。

```javascript

```

