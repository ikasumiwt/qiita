underscoreコードリーディング（delay）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##とは


###[underscorejs.orgのdelay](http://underscorejs.org/#delay)

こんな説明。
>####.delay(function, wait, *arguments) 
>Much like setTimeout, invokes function after wait milliseconds. 
>If you pass the optional arguments, they will be forwarded on to the function when it is invoked.

```javascript
var log = _.bind(console.log, console);
_.delay(log, 1000, 'logged later');
=> 'logged later' // Appears after one second.
```
------------- 
setTimeoutととても似ています。関数はwaitのミリセカンド分待ってから呼びだされます。
もしargumentsをワアした場合、それらは関数が呼び出されるときに受け渡されます。

###[underscore.delay](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L763)
コード的にはこのあたり。

```javascript

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

```

argumentsをsliceしたものをargsに格納する。
第二引数にwaitを渡したsetTimeout内でargsを渡したfunc.applyを返す。
setTimeoutを返す。
