underscoreコードリーディング（indexOf）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##indexOfとは


###[underscorejs.orgのindexOf](http://underscorejs.org/#indexOf)

こんな説明。
>####


```javascript


```
------------- 


###[underscore.zip](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L580)
コード的にはこのあたり。

```javascript

```


    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };
```
