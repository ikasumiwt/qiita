underscoreコードリーディング（wrap）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##wrapとは


###[underscorejs.orgのwrap](http://underscorejs.org/#wrap)

こんな説明。
>####_.wrap(function, wrapper) 
>Wraps the first function inside of the wrapper function, passing it as the first argument.
>This allows the wrapper to execute code before and after the function runs, adjust the arguments, and execute it conditionally.


```javascript
var hello = function(name) { return "hello: " + name; };
hello = _.wrap(hello, function(func) {
  return "before, " + func("moe") + ", after";
});
hello();
=> 'before, hello: moe, after'
```
------------- 
1つ目の関数を最初の引数として渡すことで、ラッパー関数でラップします。
関数を実行する前後のコードに、引数を調整することで、ラッパーに条件付きで関数を実行することを可能にします。


これは、関数を実行する前と後のコードを実行する引数を調整し、条件付きでそれを実行するためのラッパーを可能にします。


###[underscore.wrap](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L894)
コード的にはこのあたり。

```javascript
  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };
```
_.partialを用いて、wrapperの第一引数にfuncを渡す
