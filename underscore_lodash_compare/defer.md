underscoreコードリーディング（defer）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##とは


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


###[underscore.](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L772)
コード的にはこのあたり。

```javascript
 // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

```

_.particalと_.delayを用いて1ミリセカンド遅らせる。
