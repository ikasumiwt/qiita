underscoreコードリーディング（allKeys）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##allKeysとは


###[underscorejs.orgのallKeys](http://underscorejs.org/#allKeys)

こんな説明。
>####_.allKeys(object) 
Retrieve all the names of object's own and inherited properties.




```javascript
function Stooge(name) {
  this.name = name;
}
Stooge.prototype.silly = true;
_.allKeys(new Stooge("Moe"));
=> ["name", "silly"]

```
------------- 
すべてのプロパティの名前を返します

###[underscore.allKeys](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L938)
コード的にはこのあたり。

```javascript
  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };
```
