underscoreコードリーディング（tap）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##tapとは


###[underscorejs.orgのtap](http://underscorejs.org/#tap)

こんな説明。
>####_.tap(object, interceptor) 
Invokes interceptor with the object, and then returns object. The primary purpose of this method is to "tap into" a method chain, in order to perform operations on intermediate results within the chain.



```javascript
_.chain([1,2,3,200])
  .filter(function(num) { return num % 2 == 0; })
  .tap(alert)
  .map(function(num) { return num * num })
  .value();
=> // [2, 200] (alerted)
=> [4, 40000]
```

------------- 



###[underscore.tap](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1073)
コード的にはこのあたり。

```javascript
  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

```
