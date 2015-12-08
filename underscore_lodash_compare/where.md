underscoreコードリーディング（where）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##whereとは


###[underscorejs.orgのwhere](http://underscorejs.org/#where)

こんな説明。
>####_.where(list, properties) 
>Looks through each value in the list, returning an array of all the values that contain all of the key-value pairs listed in properties.

```javascript
_.where(listOfPlays, {author: "Shakespeare", year: 1611});
=> [{title: "Cymbeline", author: "Shakespeare", year: 1611},
    {title: "The Tempest", author: "Shakespeare", year: 1611}]

```
------------- 
エイリアスは特になし。

リストのすべてのバリューに対して、propertiesに含まれるすべてのkey-valueが含まれるarrayを返却します。


###[underscore.where](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L288)
コード的にはこのあたり。

```javascript
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };
```

[_.filter](http://qiita.com/ikasumi_wt/items/b8a9f337fccef74e695a)と_.matcherを用いて、マッチしたarrayだけをフィルタリングして返却する。

_.filterを用いているため、返却値はArrayで返される。
_.matcherはObjectに対して利用できるattrsで定義されているkey-valueと同じものが存在するかを判定できる関数を返す。

[underscore.matcher](http://underscorejs.org/#matcher)
```javascript
matcher_.matcher(attrs) Alias: matches 
Returns a predicate function that will tell you if a passed in object contains all of the key/value properties present in attrs.

var ready = _.matcher({selected: true, visible: true});
var readyToGoList = _.filter(list, ready);
```

[_.matcher](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1306)

```javascript
_.matcher = _.matches = function(attrs) {
  attrs = _.extendOwn({}, attrs);
  return function(obj) {
    return _.isMatch(obj, attrs);
  };
};
```

_.matcherの中身は_.isMatch関数を返すものなので

[_.isMatch](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1082)

```javascript
_.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };
```


つまり

```javascript
  _.where = function(obj, attrs) {
    return _.filter(obj, function(obj, attrs){
    
      var keys = _.keys(attrs), length = keys.length;
      if (object == null) return !length;
      var obj = Object(object);
      for (var i = 0; i < length; i++) {
        var key = keys[i];
        if (attrs[key] !== obj[key] || !(key in obj)) return false;
      }
      return true; 
    });
  };
```

となっている。
そのため、引数として与えられたobjの中で_.filterでtrueが返ってきたもののみで構成されたArrayが返ってくることがわかる。

