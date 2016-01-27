underscoreコードリーディング（after）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##afterとは


###[underscorejs.orgのafter](http://underscorejs.org/#after)

こんな説明。
>####_.after(count, function) 
>Creates a version of the function that will only be run after first being called count times.
>Useful for grouping asynchronous responses, where you want to be sure that all the async calls have finished, before proceeding.

```javascript
var renderNotes = _.after(notes.length, render);
_.each(notes, function(note) {
  note.asyncSave({success: renderNotes});
});
// renderNotes is run once, after all notes have saved
```
------------- 


###[underscore.](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L877)
コード的にはこのあたり。

```javascript
 // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

```

