underscoreコードリーディング（findLastIndex）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##findLastIndexとは


###[underscorejs.orgのfindLastIndex](http://underscorejs.org/#findLastIndex)

こんな説明。
>####_.findLastIndex(array, predicate, [context]) 
Like _.findIndex but iterates the array in reverse, returning the index closest to the end where the predicate truth test passes.


```javascript
var users = [{'id': 1, 'name': 'Bob', 'last': 'Brown'},
             {'id': 2, 'name': 'Ted', 'last': 'White'},
             {'id': 3, 'name': 'Frank', 'last': 'James'},
             {'id': 4, 'name': 'Ted', 'last': 'Jones'}];
_.findLastIndex(users, {
  name: 'Ted'
});
=> 3
```
------------- 
_.findLastIndexに似ているが、arrayを逆から走査し、predicateのテストでtrueが返ってきたものに一番近いindexの値をかえす。


###[underscore.findIndex](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L628)
コード的にはこのあたり。

```javascript

  _.findLastIndex = createPredicateIndexFinder(-1);
  
```

createPredicateIndexFinderに-1を渡しているのみ


[createPredicateIndexFinder](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L613)は以下

```javascript
  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }
```


dir=-1なのでこうなる

```javascript

function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = length - 1;
      for (; index >= 0 && index < length; index-- {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };

```

arrayのlength分だけfor文をindexがマイナスになるまで回す。
predicateに合致した場合はindexを返す。
for分を回しても返り値がなかった場合、-1を返す。
