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
