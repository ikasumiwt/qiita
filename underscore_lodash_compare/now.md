underscoreコードリーディング（now）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##nowとは


###[underscorejs.orgのnow](http://underscorejs.org/#now)

こんな説明。
>####_.now() 
Returns an integer timestamp for the current time, using the fastest method available in the runtime. Useful for implementing timing/animation functions.


```javascript
_.now();
=> 1392066795351
```

------------- 


###[underscore.now](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1330)
コード的にはこのあたり。

```javascript
  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };


```
