underscoreとlodashの比較(foreach)
underscoreもlodashも詳しくないので、勉強半分でソースコードを読む。

##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)

[lodash.js(v3.10.0)](https://github.com/lodash/lodash/tree/3.10.0-npm-packages)


##foreachとは
配列/連想配列 問わずに利用できる繰り返し処理を行える関数。

たとえば

```javascript
'use strict';
var _ = require( "underscore" );

var arr = [ 1, 2, 3, 4, 5 ];

_.each( arr, function(element, index, array) {
    console.log( 'element : ' + element + ' index: ' + index );

});
```

した場合も

```javascript
'use strict';
var _ = require( "underscore" );

var arr = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };

_.each( arr, function(element, index, array) {
    console.log( 'element :' + element + ' index:' + index );
});

```

した場合も同じように

```
element : 1 index: 1
element : 2 index: 2
element : 3 index: 3
element : 4 index: 4
element : 5 index: 5
```

という返り値が期待できます。


素で書いた場合

```javascript
var arr = [ 1, 2, 3, 4, 5 ];

for( var i = 0; i < arr.length; i++ ) {
    console.log( 'element:' + arr[i] + ' index:' + i );
}
```

とか

```javascript
var arr = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };
for( var key in arr ) {
    console.log( 'element:' + arr[key] + ' index:' + key );
}
```

こんな感じ


## 比較

### [underscore.each](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L148)

コードはこのへん。

```javascript:underscore.each
_.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
        for (i = 0, length = obj.length; i < length; i++) {
            iteratee(obj[i], i, obj);
        }
    } else {
        var keys = _.keys(obj);
        for (i = 0, length = keys.length; i < length; i++) {
            iteratee(obj[keys[i]], keys[i], obj);
        }
    }
    return obj;
};

```

underscoreの場合は、objectかarrayかを判定し、for文で処理をしている。
配列の場合はif文、配列ではない場合はelseで処理。

ただのobjectの場合は[_.keys](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L928)を用いて処理。


中で使われているisArrayLikeは以下

```javascript
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
var getLength = property('length');
var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
};
```

その中で使われているproperty( 'length' )は[これ](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L125)


```javascript
var property = function(key) {
    return function(obj) {
        return obj == null ? void 0 : obj[key];
    };
};
```

//このあたりからよくわからない
objがnullだったら、void 0を返す
objectだったらobj[key]を返す
今回 'length' を与えているので

```javascript
getLength = function( obj ) {

    return obj == null ? void 0 : obj['length'];

}
```
となって、void 0か配列のlengthを返している
(こういう書き方があるのか・・・)

なので、

```javascript
var length = getLength(collection);
return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
```

ではgetLengthで返ってきた値が正常な範囲のnumberだったらArrayであるとみなしている（と思う）

配列か配列じゃないかで分岐したあとは[optimizeCb](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L63)したiterateeを回している



### [lodash.forEach](https://github.com/lodash/lodash/blob/3.10.0-npm-packages/lodash.foreach/index.js#L1)

コードはこのあたり。underscoreは1ファイルだったがlodashは分割されている。
あとlodashの場合は_.eachではなく関数的には_.forEach
(_.eachにもエイリアス貼られている)

```javascript:lodash.forEach
_.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
    console.log(n, key);
});
```


```javascript
var arrayEach = require('lodash._arrayeach'),
    baseEach = require('lodash._baseeach'),
    bindCallback = require('lodash._bindcallback'),
    isArray = require('lodash.isarray');

function createForEach(arrayFunc, eachFunc) {
    return function(collection, iteratee, thisArg) {
        return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
            ? arrayFunc(collection, iteratee)
            : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
    };
}
var forEach = createForEach(arrayEach, baseEach);

module.exports = forEach;
```

起点となるのは createForEach。
（そもそも構造自体がunderscoreと違うけど）
配列/それ以外のチェックの際に
iterateeのtypeofのチェックがあるのがunderscoreと違うっぽさがある


[_.isArray](https://github.com/lodash/lodash/blob/3.10.0-npm-packages/lodash.isarray/index.js)
で配列かどうかのチェック

```javascript
var isArray = nativeIsArray || function(value) {
    return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};
```

Array.isArrayがあればそちらを利用

```javascript
var nativeIsArray = getNative(Array, 'isArray');

function getNative(object, key) {
    var value = object == null ? undefined : object[key];
    return isNative(value) ? value : undefined;
}
```
あたり


### _.arrayeach
```javascript
function arrayEach(array, iteratee) {
    var index = -1,
        length = array.length;

    while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
            break;
        }
    }
    return array;
}

```

### [_.bindcallback](https://github.com/lodash/lodash/blob/3.10.0-npm-packages/lodash._bindcallback/index.js)
```javascript
function bindCallback(func, thisArg, argCount) {
    if (typeof func != 'function') {
        return identity;
    }
    if (thisArg === undefined) {
        return func;
    }
    switch (argCount) {
        case 1: return function(value) {
                    return func.call(thisArg, value);
                };
        case 3: return function(value, index, collection) {
                    return func.call(thisArg, value, index, collection);
                };
        case 4: return function(accumulator, value, index, collection) {
                    return func.call(thisArg, accumulator, value, index, collection);
                };
        case 5: return function(value, other, key, object, source) {
                    return func.call(thisArg, value, other, key, object, source);
                };
    }
    return function() {
        return func.apply(thisArg, arguments);
    };
}

function identity(value) {
    return value;
}

```

```javascript
eachFunc(collection, bindCallback(iteratee, thisArg, 3));
```

と指定されているので、今回はcase3の

```javascript
function(value, index, collection) {
    return func.call(thisArg, value, index, collection);
};

```
を使ってiterateeを回す

・・長くなりそうなので明日に続く・・・


