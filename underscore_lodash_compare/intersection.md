underscoreコードリーディング（intersection）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##intersectionとは


###[underscorejs.orgのintersection](http://underscorejs.org/#intersection)

こんな説明。
>####_.intersection(*arrays) 
>Computes the list of values that are the intersection of all the arrays.
>Each value in the result is present in each of the arrays.

_.intersection([1, 2, 3], [101, 2, 1, 10], [2, 1]);
=> [1, 2]


```javascript
_.intersection([1, 2, 3], [101, 2, 1, 10], [2, 1]);
=> [1, 2]
```
------------- 
arraysの共通の値を求めます。
結果の中に入っているそれぞれの値は、arraysによります。


###[underscore.intersection](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L555)
コード的にはこのあたり。

```javascript
  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

```

返り値用にresultを定義。
第一引数以外のargumentsのlengthをargsLengthに格納。
arrayの個数だけ走査する。
i番目のarrayの値がresultの中に含まれていた場合はcontinueする。
それ以外の場合、argsLengthだけfor文を回す。
j番目のargumentsにitemが含まれていなかった場合はそこで走査を終わる。
jがargsLengthだった場合(正常にjのfor文が走査が終わっていた場合)itemがすべてのargumentsの配列に含まれていたことになるので、resultにpushする。

arrayのすべての値に対して同じ走査を行ったあと、resultを返却する。

