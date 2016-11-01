underscoreコードリーディング（noop）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##noopとは


###[underscorejs.orgのnoop](http://underscorejs.org/#noop)

こんな説明。
>####_.noop() 
>Returns undefined irrespective of the arguments passed to it. 
>Useful as the default for optional callback arguments.


```javascript
obj.initialize = _.noop;
```

------------- 
渡されるargumetntsに関係なく、undefinedを返す。
defaultのoptionalのcallback argumentとして役に立ちます。

###[underscore.noop](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1293)
コード的にはこのあたり。

```javascript
 _.noop = function(){};

```

