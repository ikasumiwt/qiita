underscoreコードリーディング（property）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##propertyとは


###[underscorejs.orgのproperty](http://underscorejs.org/#property)

こんな説明。
>####_.property(key) 
>Returns a function that will itself return the key property of any passed-in object.



```javascript
var stooge = {name: 'moe'};
'moe' === _.property('name')(stooge);
=> true
```

------------- 


###[underscore.property](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1305)
コード的にはこのあたり。

```javascript
  _.property = property;

```

[property](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L125)はこちら

```javascript
  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

```
