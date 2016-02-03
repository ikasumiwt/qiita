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
それぞれの関数*functionsに書かれたそれぞれの関数の値を返し続けた結果の、関数のリストで構成された値を返す
数学的に言うとf,g,hの関数が合った場合にf(g(h()))の形で表します


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

argumentsを変数argsに格納する。
startにargsの長さ-1をいれる。
関数を返す。返す関数は以下の関数。
resultにargsの一番最後に格納されている関数をapplyした結果を入れる。引数はないので、composeされた関数が実行されたときの引数はargumentsにある。
iをデクリメントしながら、resultにargs[i]にresultを与えた結果を代入し続ける。iが-1になったら終わる。
実行後、resultを返す。
