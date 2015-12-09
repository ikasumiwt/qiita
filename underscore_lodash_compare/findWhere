underscoreコードリーディング（findWhere）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##findWhereとは


###[underscorejs.orgのwhere](http://underscorejs.org/#findWhere)

こんな説明。
>####_.findWhere(list, properties) 
>Looks through the list and returns the first value that matches all of the key-value pairs listed in properties.
>If no match is found, or if list is empty, undefined will be returned.

```javascript
_.findWhere(publicServicePulitzers, {newsroom: "The New York Times"});
=> {year: 1918, newsroom: "The New York Times",
  reason: "For its public service in publishing in full so many official reports,
  documents and speeches by European statesmen relating to the progress and
  conduct of the war."}
```

------------- 
エイリアスは特になし。

listのなかで最初に、propertiesの中のすべてのkey-valueペアにマッチするものを返してくれる。
もし、マッチするものが見つからなかった、もしくはリストが空だった場合にはundefinedを返却する。



###[underscore.findWhere](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L294)

コード的にはこのあたり。

```javascript
  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };
```

_.findと_.matcherを用いて、マッチしたもののうち先頭のものを返却する。


。
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
  _.findWhere = function(obj, attrs) {
    return _.find(obj, function(obj, attrs){
    
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

