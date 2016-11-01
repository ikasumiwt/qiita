underscoreコードリーディング（unescape）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##unescapeとは


###[underscorejs.orgのunescape](http://underscorejs.org/#unescape)

こんな説明。
>####


```javascript

```

------------- 


###[underscore.unescape](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1362)
コード的にはこのあたり。

```javascript

_.unescape = createEscaper(unescapeMap);

```

_.escapeと同じだが、渡す引数がunescapeMap.
unescapeMapはescapeMapを_.invertしたもの.
そのため、&amp;を&へと変換する。

[unescapeMap](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1344)

```javascript
   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

```
