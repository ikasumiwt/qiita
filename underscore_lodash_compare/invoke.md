underscoreコードリーディング（invoke）


underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##invokeとは


###[underscorejs.orgのinvoke](http://underscorejs.org/#invoke)

こんな説明。
>####_.invoke(list, methodName, *arguments) 
>Calls the method named by methodName on each value in the list.
>Any extra arguments passed to invoke will be forwarded on to the method invocation.


```javascript
_.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
=> [[1, 5, 7], [1, 2, 3]]
```

------------- 


第二引数のmethodNameで指定したメソッドをlistのすべての値に対して実行する。
*argumentsはmethodNameで指定されたメソッドに渡される


（例示されているのだと、[5,1,3].sort と[3,2,1].sortが呼び出されている事がわかる）

```javascript
'use strict';

var _ = require( "underscore" );

var arr = [ "a", "abc", "abcde" ];$

var _arr = _.invoke( arr, 'charAt', 1 );

console.log( _arr );
```
とすると

```javascript
node invoke.js
[ '', 'b', 'b' ]
```

となる


###[underscore.invoke](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L271)

コード的にはこのあたり。

```javascript

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

```

関数としての引数は2つで、それ以外はargsとしてargumentsをsliceして受け取る。
sliceはArray.prototype.slice。
argumentsには{ obj, method, hoge, fuga, piyo }とくるため、
slice(arguments,2)で[ hoge, fuga, piyo ]をargsに格納する。

_.isFunctionでmethodがfunctionかどうかを確認する

