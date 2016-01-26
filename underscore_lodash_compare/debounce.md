underscoreコードリーディング（debounce）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##とは


###[underscorejs.orgのdebounce](http://underscorejs.org/#debounce)

こんな説明。
>####_.debounce(function, wait, [immediate]) 
>Creates and returns a new debounced version of the passed function which will postpone its execution until after wait milliseconds have elapsed since the last time it was invoked.
>Useful for implementing behavior that should only happen after the input has stopped arriving. 
>For example: rendering a preview of a Markdown comment, recalculating a layout after the window has stopped being resized, and so on.

>Pass true for the immediate argument to cause debounce to trigger the function on the leading instead of the trailing edge of the wait interval. 
>Useful in circumstances like preventing accidental double-clicks on a "submit" button from firing a second time.

```javascript
var lazyLayout = _.debounce(calculateLayout, 300);
$(window).resize(lazyLayout);
```
------------- 
生成やnewで返される時に、渡した関数の実行を、最後に実行されてからwaitミリセカンド経過させたあとに実行するように延期します。
入力したものが到着した後にのみ実行すべき動作を実装するのに便利です。
例えば：markdownコメントのプレビューをレンダリングする、リサイズのイベントが実行し終えたあとに再度レイアウトを計算し直す、など

immeddiateにtrueを渡すことによって、waitインターバルの終わったあとに実行することなく、debounceをトリガーにそのまま関数を実行できます。
突然submitボタンをダブルクリックなどを偶発的に押されてしまうような状況に役に立ちます。


###[underscore.debounce](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L817)
コード的にはこのあたり。

```javascript
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

```
func,late,immediateを引数に取る。
timeout, args, context, timestamp, resultを宣言する。
laterの関数を定義する。中身は以下。
lastに現在時刻からtimestmpを引いたミリ秒を代入する。
lastがwait以下かつlastが0以上だった場合、setTimeoutでwait-last秒まつ、
それ以外の場合、timeoutにnullを代入し、immediateがfalseの場合、resultにfunc.applyの結果を格納して返す、timeoutが存在しなかったら、contextとargsをnullにする
--ここまでlater関数
debouceは以下の関数を返す。
contextにthisを代入し、argumentsをargsに代入する。また、timestampに現在時刻を代入する。
callNowにimmediateが存在しかつタイムアウトが存在しない場合はtrueをいれ、違う場合はfalseを入れる。
timeoutが存在しない場合は、timeoutにsetTimeout(later,wait)で設定し、waitミリ秒後にlaterを実行する、
callNowが存在する場合は、resultにfunc.applyした結果を格納し、contextとargsをnullにする。
resultを返す。
