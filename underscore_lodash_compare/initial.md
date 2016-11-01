underscoreコードリーディング（initial）


underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##initialとは



###[underscorejs.orgのinitial](http://underscorejs.org/#initial)

こんな説明。
>####_.initial(array, [n]) 
>Returns everything but the last entry of the array. 
>Especially useful on the arguments object. 
>Pass n to exclude the last n elements from the result.



```javascript

_.initial([5, 4, 3, 2, 1]);
=> [5, 4, 3, 2]

```

------------- 
配列に最後に入れられた値以外のすべてを返す。
argumentsのobjectに対して特に有用です。
nを渡すことによってうしろからn番目の要素までをreturnする要素から除外することができます。


###[underscore.initial](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L462)

コード的にはこのあたり。


```javascript
  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

```

(Array.prototype.slice)[https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/slice]を用いて、引数のarrayに対して、0番目から1 or n番目までの値をsliceして返す。
