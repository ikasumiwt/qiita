underscoreコードリーディング（extendOwn）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##extendOwnとは


###[underscorejs.orgのextendOwn](http://underscorejs.org/#extendOwn)

こんな説明。
>####_.extendOwn(destination, *sources) Alias: assign 
>Like extend, but only copies own properties over to the destination object.

------------- 

extendににているけども、destination自身のpropertyだけをコピーします。


###[underscore.extendOwn](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1008)
コード的にはこのあたり。

```javascript

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

```

_.assignも同じ。
_.extendは_.allKeysを用いていたが、_.extendOwnは_.keysを用いる。
allKeysはprototypeも引っ張るが、keysはそれは返ってこない。
