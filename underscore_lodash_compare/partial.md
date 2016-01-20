underscoreコードリーディング（partial）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##partialとは


###[underscorejs.orgのpartial](http://underscorejs.org/#partial)

こんな説明。
>####_.partial(function, *arguments) 
>Partially apply a function by filling in any number of its arguments, without changing its dynamic this value.
>A close cousin of bind. You may pass _ in your list of arguments to specify an argument that should not be pre-filled, but left open to supply at call-time.


```javascript
var subtract = function(a, b) { return b - a; };
sub5 = _.partial(subtract, 5);
sub5(20);
=> 15

// Using a placeholder
subFrom20 = _.partial(subtract, _, 20);
subFrom20(5);
=> 15
```
------------- 
関数に対してargumentsに数値を埋めることによって、その値を変えることがないようにすることを部分的に適用できます。


###[underscore.](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L675)
コード的にはこのあたり。

```javascript
```
