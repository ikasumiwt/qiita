underscoreコードリーディング（isEqual）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##isEqualとは


###[underscorejs.orgのisEqual](http://underscorejs.org/#isEqual)

こんな説明。
>####_.isEqual(object, other) 
>Performs an optimized deep comparison between the two objects, to determine if they should be considered equal.


```javascript
var stooge = {name: 'moe', luckyNumbers: [13, 27, 34]};
var clone  = {name: 'moe', luckyNumbers: [13, 27, 34]};
stooge == clone;
=> false
_.isEqual(stooge, clone);
=> true

```

------------- 
2つのオブジェクトが等価であるかを決定するため、2つのobjectをdeepに比較します。

###[underscore.isEqual](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1187)
コード的にはこのあたり。

```javascript
  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

```

a,bを引数にeqを実行した結果を返す。

[eq](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1094)は以下

```javascript
 // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };
```


a===bだった場合、aが0ではない場合か(aが0だった場合は)1/a が1/bと一致した場合はtrueを返す。
そうでない場合、aがnullまたはbがnullの場合はaとbを厳密等価演算子で比較する。
そうでない場合、 aが_のinstanceだった場合はaにa._wrappedを、bが_のinstanceだった場合はbにb._wrappedを代入する
    
（[XXX._wrapped](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L38)は以下のようにunderscoreに渡されたobjが格納されている）
```javascript
  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };
```

classNameにaをtoStringした結果を入れる。
classNameがbをtoStringした結果と一致しない場合はfalseを返す。
classNameをswitch文で分岐させる。条件は以下。
[object RegExp]か[object String]だった場合、aとbを文字列にしたものを厳密比較した結果を返す。
[object Number]だった場合、 (NaN対策のため)+a !== +aだった場合は +b !== +bの結果を返す（aがNaNのため、bがNaNかどうかで判定する?）
そうではない場合、 +aが0だった場合、 1/ +a が 1/bと一致した結果を返し、-出ない場合は+aと+bを厳密等価比較し返す
[object Date]か[object Boolean]のとき、+a と +b で厳密等価比較して返す。

それらに当てはまらない場合
classNameが[object Array]と一致するかどうかをareArraysに代入する。
areArrayがfalseだった場合
typeof でaかbがobjectではなかった場合はfalseを返す。
aCtorにa.contructor,bCtorにb.constructorを代入する。
aCtorとbCtorが一致しないかつ 
_.isFunctionにaCtorやbCtorを入れた結果がfalseかつaCtorやbCtorがそれぞれのインスタンスかどうかがfalseだった場合かつ
aとbにconstructorが存在する場合
は
falseを返す。

