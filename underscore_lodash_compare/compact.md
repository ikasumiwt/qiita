underscoreコードリーディング（compact）


underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##compactとは


###[underscorejs.orgのcompact](http://underscorejs.org/#conpact)

こんな説明。
>####_.compact(array) 
>Returns a copy of the array with all falsy values removed.
>In JavaScript, false, null, 0, "", undefined and NaN are all falsy.


```javascript
_.compact([0, 1, false, 2, '', 3]);
=> [1, 2, 3]
```

------------- 
arrayのfalsyな値以外のコピーの配列を返す。
JavaScriptにおいてfalsyとはfalse, null, 0, "", undefined ,NaNのことを指す。


###[underscore.compact](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L462)

コード的にはこのあたり。


```javascript
  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };
```


_.filterを用いて、_.identityの値のみを返却する。
