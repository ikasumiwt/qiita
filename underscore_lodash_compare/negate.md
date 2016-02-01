underscoreコードリーディング（negate）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##negateとは


###[underscorejs.orgのnegate](http://underscorejs.org/#nengate)

こんな説明。
>####_.negate(predicate) 
Returns a new negated version of the predicate function.


```javascript
var isFalsy = _.negate(Boolean);
_.find([-2, -1, 0, 1, 2], isFalsy);
=> 0

```
------------- 
predicate関数の否定されたバージョンを新しく生成して返す。

###[underscore.negate](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L856)
コード的にはこのあたり。

```javascript
  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };
```

返り値は関数で、predicateにthisとargumentsを私、その否定として返す
