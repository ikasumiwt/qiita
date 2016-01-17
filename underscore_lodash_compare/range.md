underscoreコードリーディング（range）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##rangeとは


###[underscorejs.orgのrange](http://underscorejs.org/#range)

こんな説明。
>####_.range([start], stop, [step]) 
>A function to create flexibly-numbered lists of integers, handy for each and map loops.
>start, if omitted, defaults to 0; step defaults to 1. Returns a list of integers from start (inclusive) to stop (exclusive), incremented (or decremented) by step, exclusive.
>Note that ranges that stop before they start are considered to be zero-length instead of negative — if you'd like a negative range, use a negative step.


```javascript
_.range(10);
=> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
_.range(1, 11);
=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
_.range(0, 30, 5);
=> [0, 5, 10, 15, 20, 25]
_.range(0, -10, -1);
=> [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
_.range(0);
=> []
```
------------- 


###[underscore.range](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L675)
コード的にはこのあたり。

```javascript
  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };
  
```
