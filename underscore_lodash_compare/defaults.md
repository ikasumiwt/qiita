underscoreコードリーディング（defaults）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##defaultsとは


###[underscorejs.orgのdefaults](http://underscorejs.org/#defaults)

こんな説明。
>####_.defaults(object, *defaults) 
Fill in undefined properties in object with the first value present in the following list of defaults objects.


```javascript
var iceCream = {flavor: "chocolate"};
_.defaults(iceCream, {flavor: "vanilla", sprinkles: "lots"});
=> {flavor: "chocolate", sprinkles: "lots"}

```

------------- 

defaults objectsに指定されている値で、オブジェクトのundefinedなプロパティを埋めます。


###[underscore.defaults](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1055)
コード的にはこのあたり。

```javascript
  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);
```

createAssignerに_.allKeysとtrueを渡す。
