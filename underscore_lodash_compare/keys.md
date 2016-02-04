underscoreコードリーディング（keys）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##keysとは


###[underscorejs.orgのkeys](http://underscorejs.org/#keys)

こんな説明。
>####_.keys(object) 
Retrieve all the names of the object's own enumerable properties.


```javascript
_.keys({one: 1, two: 2, three: 3});
=> ["one", "two", "three"]

```
------------- 

引数で渡されたobjectの、enumerable属性のすべてのnamesを検索し、返します。


###[underscore.keys](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L926)
コード的にはこのあたり。

```javascript
  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };
```


objがobjectではなかった場合は空の配列を返す
nativeKeysが存在する場合は、nativeの[keys](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)を用いる

上記に当てはまらない場合
keysを空の配列として宣言する
for文で回し、objがkeyを持っていた場合はkeysにkeyをpushし続ける。
enumにbugがある場合はcollectNonEnumPropsを用いる。

その後、keyをあつめた配列のkeysを返す

