underscoreコードリーディング（first）


underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##firstとは


###[underscorejs.orgのfirst](http://underscorejs.org/#first)

こんな説明。
>####_.first(array, [n]) Alias: head, take 
Returns the first element of an array. Passing n will return the first n elements of the array.


```javascript

_.first([5, 4, 3, 2, 1]);
=> 5

```

------------- 

配列の最初の値を返却します。nがあれば最初からn番目までの配列を返します。


###[underscore.first](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L453)

コード的にはこのあたり。


```javascript

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

```

_.firstも _.headも _.take にもエイリアスがはってある
arrayがnullの場合はvoid 0(undefined)を返す
nがnullもしくはguardが存在する場合、元の配列のarray[0]を返す
それ以外の場合は_.initialを用いて、arrayからn番目までの値を生成して返す。（_.initialは配列全体に対して後ろからn番目までを除外するため、length-nとなる）


