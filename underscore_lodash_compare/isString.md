underscoreコードリーディング（isString）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##isStringとは


###[underscorejs.orgのisString](http://underscorejs.org/#isString)

こんな説明。
>####_.isString(object) 
Returns true if object is a String.

```javascript
_.isString("moe");
=> true
```

------------- 
objectがStringだった場合trueを返します

###[underscore.isString](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1218)
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
