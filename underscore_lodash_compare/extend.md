underscoreコードリーディング（extend）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##extendとは


###[underscorejs.orgのextend](http://underscorejs.org/#extend)

こんな説明。
>####_.extend(destination, *sources) 
>Copy all of the properties in the source objects over to the destination object, and return the destination object.
>It's in-order, so the last source will override properties of the same name in previous arguments.

```javascript
_.extend({name: 'moe'}, {age: 50});
=> {name: 'moe', age: 50}

```

------------- 

sourceのobjectsのプロパティををdestinationのオブジェクトと一緒に
sourceのオブジェクトたち
プロパティをすべてコピーします
destinationのオブジェクトに


###[underscore.extend](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1005)
コード的にはこのあたり。

```javascript
 // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

```

createAssignerに_.allKeysを渡している。


[createAssigner](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L98)は以下
```javascript
  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };
```

返り値は関数。引数はobj。
lengthにargumentsのlengthを格納する。


