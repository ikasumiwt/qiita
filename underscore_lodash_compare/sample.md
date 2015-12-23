underscoreコードリーディング（sample）


underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##sampleとは


###[underscorejs.orgのsample](http://underscorejs.org/#sample)

こんな説明。
>####_.sample(list, [n]) 
>Produce a random sample from the list.
>Pass a number to return n random elements from the list.
>Otherwise a single random item will be returned.

```javascript

_.sample([1, 2, 3, 4, 5, 6]);
=> 4

_.sample([1, 2, 3, 4, 5, 6], 3);
=> [1, 6, 2]

```

------------- 
listからランダムにサンプルを抽出する
数値nを渡すと、ランダムに返す値の数を指定できる（配列で返ってくる）
それ以外の場合は1つだけ返ってくる

###[underscore.sample](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L362)

コード的にはこのあたり。


```javascript
  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };
```

nが存在しない場合や、gurdが存在する場合_.randomを用いて返り値objのlengthの中からランダムな値のobj[x]を返す。
objがArrayじゃない場合は_.valuesを用いてそれらをvalueのみで構成される配列に変更後にobj[x]を返す

それ以外の場合はshuffleを用いてobjの中身を入れ替えた後、指定されたn個の配列を返す。
