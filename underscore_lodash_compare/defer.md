underscoreコードリーディング（defer）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##deferとは


###[underscorejs.orgのdefer](http://underscorejs.org/#defer)

こんな説明。
>####_.defer(function, *arguments) 
>Defers invoking the function until the current call stack has cleared, similar to using setTimeout with a delay of 0. 
>Useful for performing expensive computations or HTML rendering in chunks without blocking the UI thread from updating. 
>If you pass the optional arguments, they will be forwarded on to the function when it is invoked.


```javascript
_.defer(function(){ alert('deferred'); });
// Returns from the function before the alert runs.

```
------------- 

0の遅延でsetTimeoutを利用するのと同様で、現在のコールスタックがクリアされるまで関数の呼び出しを遅延させます。
高等な計算をする場合や、大量のhtmlレンダリングをUIスレッドのupdateをブロックせずに行う場合に使いやすいです。
もしargumentsを渡した場合、functionが呼び出される際に受け渡されます


###[underscore.](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L772)
コード的にはこのあたり。

```javascript
 // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

```

_.particalと_.delayを用いて1ミリセカンド遅らせる。
