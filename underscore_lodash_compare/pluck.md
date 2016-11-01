underscoreコードリーディング（pluck）


underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##invokeとは


###[underscorejs.orgのpluck](http://underscorejs.org/#pluck)

こんな説明。
>####_.pluck(list, propertyName) 
>A convenient version of what is perhaps the most common use-case for map: extracting a list of property values.


```javascript
var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
_.pluck(stooges, 'name');
=> ["moe", "larry", "curly"]
```

------------- 

mapを用いて何かをやる場合のもっともあり得るユースケース用の便利なバージョンである。
mapを用いてlistの値を抽出する

例示だとstoogeの中からnameをkeyに抽出したArrayが返ってきている



###[underscore.pluck](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L281)

コード的にはこのあたり。

```javascript
// Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

```

_.mapの中で_.property(key)に合致する値のみをreturnする。
そのため、keyにnameが入ってきた場合はnameの値のみで形成されたArrayが返却される。
