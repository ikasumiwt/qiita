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

_.escapeはcreateEscaperにescapeMapを渡す関数である。
createEscaperはmapを引数とする関数。内容は以下。
escaperを定義する。引数はmatch。map[match]を返す。
sourceに'(?:' + _.keys(map).join('|') + ')'を代入する。
testRegexpにRegExpのsourceを渡したものを代入する。
replaceRegepにRegExpにsource,'g'を渡したものを代入する。

返り値は以下の処理をもつ関数。
stringに、stringがnullだった場合は空文字を、そうでない場合はstring型にしたstringを代入する。
関数の返り値はstringに対してtestRegexp.testした結果がtrueの場合はstring.replaceにreplaceRegexp,escaperを渡したもの、falseの場合はstringを返す。



escapeMapは以下。

[underscore.escapeMap](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1335)


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

escapeMapは&,<,>,",',`の各文字と、特殊文字の対応表。

