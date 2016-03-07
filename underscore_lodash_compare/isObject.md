underscoreコードリーディング（isObject）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##isObjectとは


###[underscorejs.orgのisObject](http://underscorejs.org/#isObject)

こんな説明。
>####_.isObject(value) 
>Returns true if value is an Object. 
>Note that JavaScript arrays and functions are objects, while (normal) strings and numbers are not.


```javascript
_.isObject({});
=> true
_.isObject(1);
=> false
```

------------- 


###[underscore.isObject](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1211)
コード的にはこのあたり。

```javascript
  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };
```

