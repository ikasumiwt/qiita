underscoreコードリーディング（compose）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##composeとは


###[underscorejs.orgのcompose](http://underscorejs.org/#compose)

こんな説明。
>####_.compose(*functions) 
>Returns the composition of a list of functions, where each function consumes the return value of the function that follows. >In math terms, composing the functions f(), g(), and h() produces f(g(h())).



```javascript
var greet    = function(name){ return "hi: " + name; };
var exclaim  = function(statement){ return statement.toUpperCase() + "!"; };
var welcome = _.compose(greet, exclaim);
welcome('moe');
=> 'hi: MOE!'

```
------------- 


###[underscore.compose](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L863)
コード的にはこのあたり。

```javascript
 // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };
```
