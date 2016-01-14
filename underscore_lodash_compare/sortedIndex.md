underscoreコードリーディング（sortedIndex）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##sortedIndexとは


###[underscorejs.orgのsortedIndex](http://underscorejs.org/#sortedIndex)

こんな説明。
>####_.sortedIndex(list, value, [iteratee], [context]) 
>Uses a binary search to determine the index at which the value should be inserted into the list in order to maintain the list's sorted order. 
>If an iteratee function is provided, it will be used to compute the sort ranking of each value, including the value you pass. 
>The iteratee may also be the string name of the property to sort by (eg. length).


```javascript

_.sortedIndex([10, 20, 30, 40, 50], 35);
=> 3

var stooges = [{name: 'moe', age: 40}, {name: 'curly', age: 60}];
_.sortedIndex(stooges, {name: 'larry', age: 50}, 'age');
=> 1

```
------------- 
ソート済みのリストに対してvalueを挿入する際に、listに対してvalueが挿入されるべきindexの位置を決定するためにバイナリサーチを使います。
もし、iteratee関数が渡されていたら、各valueの値のソートする際のランク付けに利用されます。（渡したvalueに対しても）
iterateeはlengthのようなソートに使えるプロパティ名でも大丈夫です。


###[underscore.sortedIndex](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L632)
コード的にはこのあたり。

```javascript
// Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

```
