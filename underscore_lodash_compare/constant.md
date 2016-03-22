underscoreコードリーディング（constant）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##constantとは


###[underscorejs.orgのconstant](http://underscorejs.org/#constant)

こんな説明。
>####_.constant(value) 
>Creates a function that returns the same value that is used as the argument of _.constant.



```javascript
var stooge = {name: 'moe'};
stooge === _.constant(stooge)();
=> true
```

------------- 
_.constantのargumentに使われているvalueとおなじ値を返す関数を作成します。

###[underscore.constant](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1286)
コード的にはこのあたり。

```javascript
  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

```

valueを返す関数を返り値として返す
