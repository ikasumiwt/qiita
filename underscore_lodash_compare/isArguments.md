underscoreコードリーディング（isArguments）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##isArgumentsとは


###[underscorejs.orgのisArguments](http://underscorejs.org/#isArguments)

こんな説明。
>####_.isArguments(object) 
Returns true if object is an Arguments object.


```javascript
(function(){ return _.isArguments(arguments); })(1, 2, 3);
=> true
_.isArguments([1,2,3]);
=> false

```

------------- 
objectがArguments objectだった場合にtrueを返します。

###[underscore.isArguments](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1224)
コード的にはこのあたり。

```javascript
  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }


```

_.isArguments( arguments )がfalseだった場合に、引数objを元に_.has( obj, 'callee' )の結果を返す。
(callee)[https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments/callee]はarguments変数のプロパティの一つ。
