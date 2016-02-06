underscoreコードリーディング（values）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##valuesとは


###[underscorejs.orgのvalues](http://underscorejs.org/#values)

こんな説明。
>####_.values(object) 
Return all of the values of the object's own properties.


```javascript
_.values({one: 1, two: 2, three: 3});
=> [1, 2, 3]
```
------------- 
objectのプロパティのすべてのvalueを返します。

###[underscore.compose](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L948)
コード的にはこのあたり。

```javascript
  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };
```

_.keysを用いてobjのkeyの配列をkeysに格納する。
keysの長さをlengthに格納する。
valuesにlengthの長さ分の配列を作って入れる。
lengthまでの長さだけfor分を回し、keysのi番目のkeyを元にobjのvalueをi番目のvaluesに格納する
valuesを返す。
