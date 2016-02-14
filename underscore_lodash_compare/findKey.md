underscoreコードリーディング（findKey）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##findKeyとは


###[underscorejs.orgのfindKey](http://underscorejs.org/#findKey)

こんな説明。
>####_.findKey(object, predicate, [context]) 
>Similar to _.findIndex but for keys in objects. 
>Returns the key where the predicate truth test passes or undefined.


------------- 

_.findIndexに似ているが、objectの中のkeyを探すためのものである。
predicateのテストに当てはまるkeyもしくはundefinedを返す。


###[underscore.findKey](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1012)
コード的にはこのあたり。

```javascript
  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };
```


predicateにcbの結果を格納する。
keysを_.keysを用いてkeyの配列を格納し、変数keyも宣言する。
for分を用いてkeysの中を走査する。
keyにkeysのi番目を入れる。
predicateにobjのkeyに対応するvalueと、keyと、objを渡し、その返り値がtrueだった場合はkeyを返す。
（合致しなければ何も返さない・・・）
