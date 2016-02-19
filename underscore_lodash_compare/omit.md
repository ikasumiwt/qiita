underscoreコードリーディング（omit）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##omitとは


###[underscorejs.orgのomit](http://underscorejs.org/#omit)

こんな説明。
>####_.omit(object, *keys) 
>Return a copy of the object, filtered to omit the blacklisted keys (or array of keys).
>Alternatively accepts a predicate indicating which keys to omit.


```javascript
_.omit({name: 'moe', age: 50, userid: 'moe1'}, 'userid');
=> {name: 'moe', age: 50}
_.omit({name: 'moe', age: 50, userid: 'moe1'}, function(value, key, object) {
  return _.isNumber(value);
});
=> {name: 'moe', userid: 'moe1'}
```

------------- 

（pickの反対）
ブラックリストに登録されたkeys（もしくはkeysの配列）をフィルターしたあとのコピーされたオブジェクトを返します。
もしくは、keysの代わりにpredicateの関数を指定することによって除外することができます。

###[underscore.omit](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1044)
コード的にはこのあたり。

```javascript
   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

```

iterateeがfunctionだった場合、iterateeをnegateのiterateeとして代入する。
そうでない場合、_.mapを用いて、argumentsをflattenで配列化したものをStringにして?配列化する。
iterateeに_.containsの否定の結果を返すfunctionを代入する。

_.pickを用いた結果を返す（_.negateもしくはcontainsの否定を利用するので、pickの否定の形となる）
