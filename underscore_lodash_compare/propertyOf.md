underscoreコードリーディング（propertyOf）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##propertyOfとは


###[underscorejs.orgのpropertyOf](http://underscorejs.org/#propertyOf)

こんな説明。
>####_.propertyOf(object) 
>Inverse of _.property. 
>Takes an object and returns a function which will return the value of a provided property.


```javascript
var stooge = {name: 'moe'};
_.propertyOf(stooge)('name');
=> 'moe'
```

------------- 


###[underscore.propertyOf](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1297)
コード的にはこのあたり。

```javascript
// Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

```

objがnullの場合は空の関数を、nullではない場合はkeyを引数にobj.keyを返す関数を返す。
