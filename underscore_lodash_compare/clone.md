underscoreコードリーディング（clone）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##cloneとは


###[underscorejs.orgのclone](http://underscorejs.org/#clone)

こんな説明。
>####_.clone(object) 
>Create a shallow-copied clone of the provided plain object.
>Any nested objects or arrays will be copied by reference, not duplicated.


```javascript
_.clone({name: 'moe'});
=> {name: 'moe'};

```

------------- 



###[underscore.clone](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1067)
コード的にはこのあたり。

```javascript
  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

```

objが_.isObjectに引っかからなかった場合はobjを返す。
objが_.isArrayに引っかった場合、sliceをしたものを返す。違う場合、_.extendを用いて空の配列に対してobjをextendすることによってコピーされたobjを返すことができる。
