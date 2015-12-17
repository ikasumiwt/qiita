underscoreコードリーディング（mmin）


underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##minとは


###[underscorejs.orgのmax](http://underscorejs.org/#min)

こんな説明。
>####_.min(list, [iteratee], [context]) 
>Returns the minimum value in list.
>If an iteratee function is provided, it will be used on each value to generate the criterion by which the value is ranked. 
>Infinity is returned if list is empty, so an isEmpty guard may be required.

```javascript
var numbers = [10, 5, 100, 2, 1000];
_.min(numbers);
=> 2
```

------------- 

listの中の最低値を返す。
もしiteratee関数が渡された場合、それを用いてそれぞれの値の判定に用います。
Infinityが返されるのは、listが空なためです。そのため、isEmptyで事前に防ぐことが必要です。

###[underscore.min](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L323)

コード的にはこのあたり。

```javascript
  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };
```

基本的にはmaxと同じ。
result,lastComputedにInfinityを初期値として与える
iterateeが存在しないかつobjがnull以外の場合、objがArrayか連想配列かの判定後にfor文で配列の中を走査する。
その中の値の中で最低値をresultに格納し、resultを返却する。

それ以外の場合、iterateeが関数かどうかを判定し、_.eachを用いて、objを走査する。
objの値ごとに、iterateeを実行し、iterateeで返却された値が今までのobjのiterateeの実行値よりも地裁場合はresultにobjの値(value)を格納する。
その後、最低値をresultとして返却する
