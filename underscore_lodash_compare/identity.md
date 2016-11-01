underscoreコードリーディング（identity）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##identityとは


###[underscorejs.orgのidentity](http://underscorejs.org/#identity)

こんな説明。
>####_.identity(value) 
>Returns the same value that is used as the argument. In math: f(x) = x
>This function looks useless, but is used throughout Underscore as a default iteratee.


```javascript
var stooge = {name: 'moe'};
stooge === _.identity(stooge);
=> true
```

------------- 
argumentとして利用されるvalueと同じvalueを返す。例えば数学で言うとf(x) = xの数式のよう。
この関数は使いにくそうに見えるが、Underscore全体でdefaultのiterateeとして利用される


###[underscore.identity](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1281)
コード的にはこのあたり。

```javascript
  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };
```

引数のvalueを返す。
