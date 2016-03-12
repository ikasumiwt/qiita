underscoreコードリーディング（isDate）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##isDateとは


###[underscorejs.orgのisDate](http://underscorejs.org/#isDate)

こんな説明。
>####__.isDate(object) 
Returns true if object is a Date.

```javascript
_.isDate(new Date());
=> true
```

------------- 
objectがDateだった場合にtrueを返します

###[underscore.isDate](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1218)
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
