underscoreコードリーディング（isNumber）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##isNumberとは


###[underscorejs.orgのisNumber](http://underscorejs.org/#isNumber)

こんな説明。
>####_.isNumber(object) 
Returns true if object is a Number (including NaN).

```javascript
_.isNumber(8.4 * 5);
=> true
```

------------- 
objectがnumber(NaNを含む)だった場合にtrueを返します

###[underscore.isNumber](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1218)
コード的にはこのあたり。

```javascript
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });
```

引数はobj
toString.call(obj)した結果が[object String]と合致した場合はtrueを返す
