underscoreコードリーディング（throttle）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##throttleとは


###[underscorejs.orgのthrottle](http://underscorejs.org/#throttle)

こんな説明。
>####_.throttle(function, wait, [options]) 
>Creates and returns a new, throttled version of the passed function, that, when invoked repeatedly, will only actually call the original function at most once per every wait milliseconds.
>Useful for rate-limiting events that occur faster than you can keep up with.

>By default, throttle will execute the function as soon as you call it for the first time, and, if you call it again any number of times during the wait period, as soon as that period is over. 
>If you'd like to disable the leading-edge call, pass {leading: false}, and if you'd like to disable the execution on the trailing-edge, pass {trailing: false}.

```javascript

var throttled = _.throttle(updatePosition, 100);
$(window).scroll(throttled);

```
------------- 
繰り返し関数が呼び出された時、生成されるときやnewが返されるとき、渡された関数のバージョンを絞り、毎回waitミリ秒ごとに一度だけ元の関数をコールするようにします。
ついていくよりも発生するほうが早い？イベントのレートを制限するときに便利です
デフォルトでは、throttleは最初の時は関数を渡された瞬間に実行しますが、もし2回以上waitミリセカンド以内に呼び出されたときには、その時間を待ってからすぐに実行します。
もしleading-edgeを呼ぶのをやめたいときは{leading: false}を、trailing-edgeを呼ぶのをやめたいときは{trailing: false}.をオプションで渡してください

###[underscore.throttle](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L776)
コード的にはこのあたり。

```javascript
 // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
```

