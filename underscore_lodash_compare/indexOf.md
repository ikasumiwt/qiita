underscoreコードリーディング（indexOf）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##indexOfとは


###[underscorejs.orgのindexOf](http://underscorejs.org/#indexOf)

こんな説明。
>####_.indexOf(array, value, [isSorted]) 
>Returns the index at which value can be found in the array, or -1 if value is not present in the array. 
>If you're working with a large array, and you know that the array is already sorted, pass true for isSorted to use a faster binary search ... or, pass a number as the third argument in order to look for the first matching value in the array after the given index.


```javascript

_.indexOf([1, 2, 3], 2);
=> 1

```
------------- 
arrayの中でvalueの値がある最初のindexの値を返します。
もしvalueがarrayの中に存在しなかった場合は-1を返します。
もし、indexOfを大きな配列で動かそうとした場合、事前にソート済みであればisSortedにtrueを与えいることによってより高速なバイナリサーチを利用できます。
もしくはindexを与えたあとに、配列内で最初にマッチした値を見つけるために第三引数に数字を渡します（？）


###[underscore.indexOf](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L672)
コード的にはこのあたり。

```javascript
// Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  
```

_.indexOf自体はcreateIndexFinderに値を渡しているのみ。

[createIndexFinder](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L643)は以下

```javascript
  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }
```
_.indexOfの場合はdirに1、predocateFindに_.findIndex,sortedIndexに _.sortedIndexが入る。
返されるのは関数で、array,item,idxの3つの引数を持つ関数を返す。

つまりこうなる
```javascript
function(array, item, idx) {
      var predicateFind = _.findIndex;
      var sortedIndex = _.sortedIndex;
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = i ; idx >= 0 && idx < length; idx += 1) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
```
for文用のiとarrayのlengthを格納した変数lengthを定義する。

idxがnumberだった場合、dirは1なので、
i = idx >= 0 ? idx : Math.max(idx + length, i);
のほうに入る。
idxが存在し、1以上の場合はidxを、そうでない場合はidx+lengthとiの大きい方をiに代入する。

idxがnumberではなく、sortedIndexが存在するかつidxが存在するかつlengthが存在する場合（ソート済みの場合）は
array,itemを_.sortedIndexにかけた結果をidxに格納する。
sortedIndexはarrayの中でitemの要素が来る最初の箇所を返すため、arrayのidx番目がitemと合致した場合はidxを返すとindexの箇所にあたる。


itemがitemじゃない場合（？）は
arrayをi番目からlength番目までsliceし、それをisNaNがマッチするまで_.findIndexにかけ、マッチした箇所をidxに代入する。
idxが0以上だったら（マッチしてる箇所があったら）idx+iを、そうでない場合は-1を返す。

それら全てに当てはまらなかった場合は、dir=1なので、idxにiを代入し、idxが0以上かつidxがlengthに達するまで、i++する。
その中で、array[idx]がitemとマッチした場合はそのidxを返す。

これらに全て合致しなかった場合は-1を返す。
