underscoreコードリーディング（last）


underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##lastとは



###[underscorejs.orgのlast](http://underscorejs.org/#last)

こんな説明。
>####_.last(array, [n]) 
Returns the last element of an array. Passing n will return the last n elements of the array.

```javascript
_.last([5, 4, 3, 2, 1]);
=> 1

```

------------- 
配列の最後の要素を返す。nが渡された場合は後ろからn個の要素を配列で返す。



###[underscore.last](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L469)

コード的にはこのあたり。


```javascript
  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };


```

arrayがない場合はvoid 0(undefined)。
bがない場合は配列の一番最後の値。
それらに一致しない場合は_.restにarray.lengthからnひいたものを渡した結果を返す。
_.restは_.initialと同じく内部でsliceをcallしていて、(_.initialが前からn個なのに対して)後ろから引数分の配列を生成して返す。


ソースコードを見てから気づいたけれど、
_.lastも_.firstも_.last([1,2,3])と_.last([1,2,3],1)だと返り値の型が違うので注意が必要
