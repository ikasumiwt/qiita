underscoreコードリーディング（shuffle）


underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##shuffleとは


###[underscorejs.orgのshuffle](http://underscorejs.org/#shuffle)

こんな説明。
>####_.shuffle(list) 
>Returns a shuffled copy of the list, using a version of the Fisher-Yates shuffle.


```javascript

_.shuffle([1, 2, 3, 4, 5, 6]);
=> [4, 1, 6, 3, 5, 2]

```

------------- 
listのコピーをシャッフルして返す。Fisher-Yates shuffleを用いる。

###[underscore.shuffle](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L348)

コード的にはこのあたり。


```javascript
  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };
```

(Fisher-Yates shuffle)[https://ja.wikipedia.org/wiki/%E3%83%95%E3%82%A3%E3%83%83%E3%82%B7%E3%83%A3%E3%83%BC_-_%E3%82%A4%E3%82%A7%E3%83%BC%E3%83%84%E3%81%AE%E3%82%B7%E3%83%A3%E3%83%83%E3%83%95%E3%83%AB]
を用いている。

いつものようにisArrayLikeを用いて、配列/連想配列かの判定を行う。
配列だった場合はそのまま、連想配列だった場合は_.valuesを用いて連想配列の値のみをsetに代入する。
その配列の数をlengthに代入する。
returnするためのシャッフルした値をいれるための配列shuffledを宣言する。配列の個数はobjに準ずる。

あとはfor文で回す。
for文では_.randomを用いて、0からindexまでのランダムな値をいれる。
randがindexと同値ではない場合、shuffled[index]にshuffled[rand]を代入する。
その後、shuffled[rand]に元の配列のindex番目の値を代入する。



ちなみに_.randomは以下。minとmaxの間の値をランダムに返される。
最速のシャッフルといわれるのは、アルゴリズムが配列の個数N-1しか試行回数(オーダー)が　ないことからである

(_.random)[https://github.com/jashkena
s/underscore/blob/1.8.3/underscore.js#L1322]

```javascript
  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

```

