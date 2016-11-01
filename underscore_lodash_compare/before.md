underscoreコードリーディング（before）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##beforeとは


###[underscorejs.orgのbefore](http://underscorejs.org/#before)

こんな説明。
>####_.before(count, function) 
>Creates a version of the function that can be called no more than count times.
>The result of the last function call is memoized and returned when count has been reached.

```javascript
var monthlyMeeting = _.before(3, askForRaise);
monthlyMeeting();
monthlyMeeting();
monthlyMeeting();
// the result of any subsequent calls is the same as the second call
```
------------- 
count回数より多く呼ぶことができない関数を生成します。
最後に呼ばれた関数の結果を覚えておき、count回数になるまでその関数の結果がが返されます。

###[underscore.](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L885)
コード的にはこのあたり。

```javascript
 // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };
```

timesを前置デクリメントし、0以上であればmemoにfuncを実行した結果を入れ返り値にする。
もしtimesが1以下になった場合にはfuncにnullを代入し、次回以降よばれても利用できないようにする。

