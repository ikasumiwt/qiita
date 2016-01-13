underscoreコードリーディング（lastIndexOf）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##indexOfとは


###[underscorejs.orgのlastIndexOf](http://underscorejs.org/#lastIndexOf)

こんな説明。
>####_.lastIndexOf(array, value, [fromIndex]) 
>Returns the index of the last occurrence of value in the array, or -1 if value is not present.
>Pass fromIndex to start your search at a given index.


```javascript

_.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
=> 4

```
------------- 
arrayの中でvalueが最後に出現するvalueのindexを返します。
もしvalueがarrayの中に存在しなかった場合は-1を返します。
fromIndexを渡すと、その箇所からの検索を開始します。


###[underscore.lastIndexOf](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L673)
コード的にはこのあたり。

```javascript

_.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
  
```

_.lastIndexOf自体はcreateIndexFinderに値を渡しているのみ。(indexOfと同様)

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
_.lastIndexOfの場合はdirに-11、predocateFindに_.findLastIndexが入る。

返されるのは関数で、array,item,idxの3つの引数を持つ関数を返す。

つまりこうなる


```javascript
function(array, item, idx) {
      var predicateFind = _.findIndex;
      var sortedIndex = undefined;
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
