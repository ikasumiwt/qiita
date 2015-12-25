underscoreコードリーディング（size）


underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##sizeとは


###[underscorejs.orgのsize](http://underscorejs.org/#size)

こんな説明。
>####_.size(list) 
>Return the number of values in the list.

```javascript

_.size({one: 1, two: 2, three: 3});
=> 3

```

------------- 

listのvalueの個数を返します


###[underscore.size](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L433)

コード的にはこのあたり。


```javascript

// Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };


```

objがない場合は0を返す
objが配列もしくは配列に似た構造の場合は、lengthを用いてカウントし、それ以外の場合は_.keysを用いて配列に整形しなおした後、lengthでカウントし、その値を返す

