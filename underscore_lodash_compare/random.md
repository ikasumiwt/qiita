underscoreコードリーディング（random）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##randomとは


###[underscorejs.orgのrandom](http://underscorejs.org/#random)

こんな説明。
>####


```javascript

```

------------- 


###[underscore.random](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1321)
コード的にはこのあたり。

```javascript
  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };
```

