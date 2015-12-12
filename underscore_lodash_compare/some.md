underscoreコードリーディング（some）



underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##someとは


###[underscorejs.orgのevert](http://underscorejs.org/#some)

こんな説明。
>####_.some(list, [predicate], [context]) Alias: any 
>Returns true if any of the values in the list pass the predicate truth test.
>Short-circuits and stops traversing the list if a true element is found.

```javascript
_.some([null, 0, 'yes', false]);
=> true
```

------------- 
_.anyもエイリアスが張られている

predicateのテストにすべての値がパスしなくてもtrueを返す（つまり1つでもtrueがあったらtrueを返す）
listのelementにtrueが見つかった時点でlistの中を走査するのをやめる。

つまり


```javascript
_.some( [1, 2, 3, 4, 5], function( num ){
  console.log( num );
  return num > 3 ? true : false;
});
=> 1 2 3 4
```

となる


###[underscore.some](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L250)

コード的にはこのあたり。

```javascript
  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

```



contextがない場合、cb(predicate)ではそのままpredicateが返ってくる
keysにはobjがArrayならfalse,objがobjectの場合にはkeysが入り、lengthはkeysかobj.lengthが入る。
それらを元にfor文で回して、predicateでtrueがreturnされた場合にはtrueが返され、そこで終了する。
for文内で条件が一致しなかった場合にはfalseが返される。
