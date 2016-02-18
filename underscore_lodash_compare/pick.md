underscoreコードリーディング（pick）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##pickとは


###[underscorejs.orgのpick](http://underscorejs.org/#pick)

こんな説明。
>####_.pick(object, *keys) 
>Return a copy of the object, filtered to only have values for the whitelisted keys (or array of valid keys). 
>Alternatively accepts a predicate indicating which keys to pick.


```javascript
_.pick({name: 'moe', age: 50, userid: 'moe1'}, 'name', 'age');
=> {name: 'moe', age: 50}
_.pick({name: 'moe', age: 50, userid: 'moe1'}, function(value, key, object) {
  return _.isNumber(value);
});
=> {age: 50}

```

------------- 
ホワイトリストにしていされたキーを通過した値のオブジェクトのコピーを返します。
もしくは、keyを抽出するのにpredicateを指定するというのも受け付けられます。

###[underscore.pick](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1022)
コード的にはこのあたり。

```javascript
  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };
```

返り値用のresult、oiteratee,keysを宣言し、objにobjectを代入する。

objがnullの場合result(空のオブジェクト)を返す。
oiterateeがfunvtionの場合、keysに_.allKeys(obj)の返り値を入れ、iterateeにoiterateeをoptimizeCbした返り値を入れる。
そうではない場合は、keysをflattenを用いてargumentsをarrayにして代入する。
iterateeにkeyがobjに入っているかどうかを判定するだけの関数を代入する。

for文でi=0からkeysのlengthまで回す。
keyにkeysのi番目を代入する。
valueにobjのkey番目を代入する。
iterateeを用いて、vakue,key,objが条件に一致するかを判定し、一致した場合resultのkey番目にvalueを代入する。

その後、resultを返す。

