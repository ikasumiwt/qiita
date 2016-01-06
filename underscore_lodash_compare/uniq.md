underscoreコードリーディング（uniq）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##uniqとは


###[underscorejs.orgのuniq](http://underscorejs.org/#uniq)

こんな説明。
>####_.uniq(array, [isSorted], [iteratee]) Alias: unique 
>Produces a duplicate-free version of the array, using === to test object equality.
>In particular only the first occurence of each value is kept.
>If you know in advance that the array is sorted, passing true for isSorted will run a much faster algorithm.
>If you want to compute unique items based on a transformation, pass an iteratee function.


```javascript
_.uniq([1, 2, 1, 4, 1, 3]);
=> [1, 2, 4, 3]
```
------------- 
===での等値比較を利用した形での、重複のない形のarrayを生成します。
特にはじめて出現したそれぞれの値は絶対に存在します。
もし、そのarrayがソート済みだと事前にわかっている場合、isSortedにtrueを渡すことによって、もっと高速なアルゴリズムで計算します。
もし、計算に基づいたユニークなアイテムを求めたい場合は、iterateeに関数を渡すことによって計算できる


###[underscore.uniq](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L519)
コード的にはこのあたり。

```javascript
 // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };
```
uniqueにもエイリアスが張られている
isSortedがtrueの場合、contextにiterateeを代入、iterateeにisSorted(true)を代入、isSorteedをfalseにする。

iterateeがnullではない場合、cbに渡して返り値で置き換える
返り値用のresultとseenを配列として定義する。
配列の長さだけfor文を回す。
valueに配列のi番目の値を格納、iterateeが存在すればcomputedにiterateeにvalue,i,arrayを渡した結果を、そうでない場合はvalueを格納
isSortedがtrueであれば
iが存在しないか、seenがcomputedではない場合はresultに格納する
その後、seenにcomputedを代入する//既にsortedなので、[1,1,2,3,3,3,4]のような形で、ひとつ前の値とのみ比較すれば良いため

isSortedがtrueではなく、iterateeが存在する場合はseenがcomputedに含まれているかどうかの確認後、含まれていない場合はseenにcomputedを、resultにvalueをpushする。

isSortedがtrueではなく、さらにiterateeもない場合、かつresultにvalueが含まれていない場合はresultにvalueをpushする。

これらを繰り返した後、resultを返す。


