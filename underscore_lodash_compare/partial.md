underscoreコードリーディング（partial）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##partialとは


###[underscorejs.orgのpartial](http://underscorejs.org/#partial)

こんな説明。
>####_.partial(function, *arguments) 
>Partially apply a function by filling in any number of its arguments, without changing its dynamic this value.
>A close cousin of bind.
>You may pass _ in your list of arguments to specify an argument that should not be pre-filled, but left open to supply at call-time.


```javascript
var subtract = function(a, b) { return b - a; };
sub5 = _.partial(subtract, 5);
sub5(20);
=> 15

// Using a placeholder
subFrom20 = _.partial(subtract, _, 20);
subFrom20(5);
=> 15
```
------------- 
関数に対してargumentsに数値を埋めることによって、その値を変えることがないようにすることを部分的に適用できます。
bindの親戚みたいなものです。
_をargumentsで渡すことによって事前に埋めないようにできます。ただし、その場合は呼び出すタイミングでその値を渡さなければいけません。


###[underscore.partial](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L721)
コード的にはこのあたり。

```javascript
 // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };
```

argumentsをsliceしてboundArgsに格納する。
boundに以下のような関数を生成し格納する。
positionに0,lengthにboundArgsの配列の長さ、argsにlengthの長さの配列を生成する。
0からlengthの長さまでfor分を回し、args[i]に、argumentsで渡された値が_ではない場合はboundArgsのi番目を、_の場合はargumentsのposition番目を入れ、positionをインクリメントする。
lengthまでargsに格納した後、
positionがargumentsの長さに達するまでargsにさらにpushする。

その後、executeBoundを返却する。


というboundを返却する


[executeBound](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L698)は以下

```javascript
  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };
```

callingContextがboundFuncのインスタンスじゃない場合はsourceFuncをapplyして返す。
インスタンスの場合は変数selfにbaseCreateしたものを代入する。
resultにsourceFuncをapplyしたものを作り、resultがobjectだったらそれを返し、そうじゃない場合はself自体を返す。


[baseCreate](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L116)は以下

```javascript
 // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };
```


baseCreateはprototypeがObjectでなかったら{}を返却し、nativeCreateが存在する場合はnativeCreateで返す（nativeCreate = Object.create;）

それらもない場合はCtor.protoprtpeに代入し、Ctorをnewし、Ctor.prototypeをnullにしたあとにresultを返す
