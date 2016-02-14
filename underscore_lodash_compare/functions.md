underscoreコードリーディング（functions）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##functionsとは


###[underscorejs.orgのfunctions](http://underscorejs.org/#functions)

こんな説明。
>####_.functions(object) Alias: methods 
>Returns a sorted list of the names of every method in an object — that is to say, the name of every function property of the object.


```javascript
_.functions(_);
=> ["all", "any", "bind", "bindAll", "clone", "compact", "compose" ...
```

------------- 

objectにあるすべてのメソッドの名前（言い換えると、これは、objectのプロパティのすべての関数の名前）をソート済みのリストにして返します。

###[underscore.function](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L995)
コード的にはこのあたり。

```javascript
  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };
```

functionsとmethodsとして利用できる。引数はobj。
返り値用の変数namesを空の配列として宣言する。
objをfor inで回す。
_.isFunctionでobj[key]がfunctionと判定された場合、namesにkeyを入れる。
for文が終わったらnamesをソート後返す。
