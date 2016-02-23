underscoreコードリーディング（has）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##hasとは


###[underscorejs.orgのhas](http://underscorejs.org/#has)

こんな説明。
>####_.has(object, key) 
>Does the object contain the given key? 
>Identical to object.hasOwnProperty(key), but uses a safe reference to the hasOwnProperty function, in case it's been overridden accidentally.


```javascript
_.has({a: 1, b: 2, c: 3}, "b");
=> true
```

------------- 
objectが与えられたkeyを持っているかどうかをhasOwnpropertyを用いて調べませんか？
突発的にhasOwnPropertyがオーバーライドされてしまったりした場合でも使える安全な参照をした形で提供します。


###[underscore.has](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1265)
コード的にはこのあたり。

```javascript
  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

```

underscore内のhasOwnPropertyをcallして返す。
