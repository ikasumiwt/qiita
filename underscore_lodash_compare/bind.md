underscoreコードリーディング（bind）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##bindとは


###[underscorejs.orgのbind](http://underscorejs.org/#bind)

こんな説明。
>####_.bind(function, object, *arguments) 
>Bind a function to an object, meaning that whenever the function is called, the value of this will be the object.
>Optionally, pass arguments to the function to pre-fill them, also known as partial application.
>For partial application without context binding, use partial.

```javascript
var func = function(greeting){ return greeting + ': ' + this.name };
func = _.bind(func, {name: 'moe'}, 'hi');
func();
=> 'hi: moe'
```
------------- 
関数が呼び出されるときに、その値がobjectであるというように、オブジェクトを関数に紐付けます。
必須ではないけれど、argumentsを渡すことによって、事前に値を埋めておくことができます。（partial applicationとして知られているように？）




###[underscore.bind](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L708)
コード的にはこのあたり。

```javascript
  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };
```

[nativeBind(function.prototype.bind)](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)があるかつfunc.bindがそれだった場合、function.prototype.bindを利用する
funcがfunctionじゃなかった場合、[TypeError](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/TypeError)を返す。
そうでない場合、argsに第三引数以降を格納する。
boundsに変え率に引数func,bound,contextとthis自体とargs.concatのargumentsをsliceしたものを返す新しい関数を格納しておく。
その後、boundを返す。
