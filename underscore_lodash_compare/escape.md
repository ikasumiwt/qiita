underscoreコードリーディング（escape）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##escapeとは


###[underscorejs.orgのescape](http://underscorejs.org/#escape)

こんな説明。
>####_.escape(string) 
>Escapes a string for insertion into HTML, replacing &, <, >, ", `, and ' characters.


```javascript
_.escape('Curly, Larry & Moe');
=> "Curly, Larry &amp; Moe"
```

------------- 
HTMLに挿入するための文字列をエスケープします。
エスケープするのは&, <, >, ", `, 'です。

###[underscore.escape](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1346)
コード的にはこのあたり。

```javascript
  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);

```

[underscore.escape](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1335)


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
```


[underscore.escape](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1381)

```javascript
  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

```
