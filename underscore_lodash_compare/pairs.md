underscoreコードリーディング（pairs）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##pairsとは


###[underscorejs.orgのpairs](http://underscorejs.org/#pairs)

こんな説明。
>####_.pairs(object) 
>Convert an object into a list of [key, value] pairs.


```javascript
_.pairs({one: 1, two: 2, three: 3});
=> [["one", 1], ["two", 2], ["three", 3]]
```
------------- 
objectをkey,valueのペアのリストに変換します。

###[underscore.compose](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L974)
コード的にはこのあたり。

```javascript
  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };
```

keysにobjを_.keysに入れた結果を格納する。
keysの長さをlengthに格納する。
lengthの長さ分だけarrayを生成し、pairsに入れる。
index=0からlengthの長さだけfor文を回す
pairsのi番目に [keys[i], obj[keys[i]]]を入れる。
その後、pairsを返す。



