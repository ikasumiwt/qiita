underscoreコードリーディング（matcher）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##matcherとは


###[underscorejs.orgのmatcher](http://underscorejs.org/#matcher)

こんな説明。
>####_.matcher(attrs) Alias: matches 
>Returns a predicate function that will tell you if a passed in object contains all of the key/value properties present in attrs.

```javascript
var ready = _.matcher({selected: true, visible: true});
var readyToGoList = _.filter(list, ready);
```

------------- 
attrに指定したすべてのkey/valueが、objectに含まれているかのテストを通したい時に使えるような関数を返します。


###[underscore.matcher](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1305)
コード的にはこのあたり。

```javascript
  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };
```

_.matcherと_.matchesにエイリアスが張られている。
attrsに指定されたものを_.extendOwnを用いてコピーする。
objを引数に持ち、_.isMatchを用いてobjにattrsが含まれているかどうかの結果を返す関数を返す。
