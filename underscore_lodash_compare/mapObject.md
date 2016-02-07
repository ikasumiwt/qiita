underscoreコードリーディング（mapObject）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##mapObjectとは


###[underscorejs.orgのmapObject](http://underscorejs.org/#mapObject)

こんな説明。
>####_.mapObject(object, iteratee, [context]) 
>Like map, but for objects. 
>Transform the value of each property in turn.

```javascript
_.mapObject({start: 5, end: 12}, function(val, key) {
  return val + 5;
});
=> {start: 10, end: 17}
```
------------- 
mapに似ているけれど、objectのためのものです。
それぞれのプロパティの値を順々に変化させます。


###[underscore.compose](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L863)
コード的にはこのあたり。

```javascript
  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

```

obj,iteratee,contextを引数に取る。
iterateeをcbに私、返り値をiterateeに上書きする。
keysにobjを_.keysに渡した返り値を、lengthにkeysの長さを格納し、resultsに空のオブジェクト、currentKeyを宣言する。

for文をindex=0からlengthまで回す。
currentKeyにkeysのindex番目を代入する。
resultsのcurrentKey番目にiterateeにobj[currentKey]とcurrentKey,objを渡した返り値を格納する。
for文の走査が終わったあとにresultsを返す。

