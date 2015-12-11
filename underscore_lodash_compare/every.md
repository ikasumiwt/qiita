underscoreコードリーディング（every）



underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##everyとは


###[underscorejs.orgのevert](http://underscorejs.org/#every)

こんな説明。
>####_.every(list, [predicate], [context]) Alias: all 
>Returns true if all of the values in the list pass the predicate truth test.


```javascript
_.every([true, 1, null, 'yes'], _.identity);
=> false
```

------------- 
_.allもエイリアスが張られている

listのすべての値がpassしたらtrueを返す


###[underscore.every](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L239)

コード的にはこのあたり。

```javascript
  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };
```

predicateは必須ではないが
・cbはfunctionがきていたらそのままpredicateを返すので変わらず

keyはobjがArrayじゃなければ_.keysを用いてobjのkeyのarrayにする
lengthはkeysがあればkeys.length,なければobj.length(どちらもArray.length)

あとはスタンダードにarray/objectの中身を走査して、obj[currentKey]とcurrentKeyを使ってpredicate内での条件に一致しなかった場合にはfalse,何事もなく通った場合はtrueを返す


