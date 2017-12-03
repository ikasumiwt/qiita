## addHeaderLine

ソース: https://github.com/nodejs/node/blob/master/lib/_http_incoming.js#L286

``` javascript
// Add the given (field, value) pair to the message
//
// Per RFC2616, section 4.2 it is acceptable to join multiple instances of the
// same header with a ', ' if the header in question supports specification of
// multiple values this way. The one exception to this is the Cookie header,
// which has multiple values joined with a '; ' instead. If a header's values
// cannot be joined in either of these ways, we declare the first instance the
// winner and drop the second. Extended header fields (those beginning with
// 'x-') are always joined.
function _addHeaderLine(field, value, dest) {
  field = matchKnownFields(field);
  var flag = field.charCodeAt(0);
  if (flag === 0 || flag === 2) {
    field = field.slice(1);
    // Make a delimited list
    if (typeof dest[field] === 'string') {
      dest[field] += (flag === 0 ? ', ' : '; ') + value;
    } else {
      dest[field] = value;
    }
  } else if (flag === 1) {
    // Array header -- only Set-Cookie at the moment
    if (dest['set-cookie'] !== undefined) {
      dest['set-cookie'].push(value);
    } else {
      dest['set-cookie'] = [value];
    }
  } else if (dest[field] === undefined) {
    // Drop duplicates
    dest[field] = value;
  }
}

```

----

// コメント
RFC2616のセクション4.2によると、もし、該当のヘッダーが複数の値をサポートしている場合、カンマ（,）でつなげて受け入れることが出来ます。
1つの例外として、クッキーヘッダーがあります。この場合、複数の値はセミコロンで繋げられています。
もし、ヘッダーの値をこれらの（カンマorセミコロンでの）方法で繋げられなかった場合、1つ目のインスタンスを優先的に扱い、2つ目以降を削除します。
ただし、x-で始まるヘッダーは常に結合されます。

----

(field, value)形式で与えられた値をmessageに追加する

引数はfield, value, destの3つ。

fieldはmatchKnownFieldsに合致しているか判定され、返り値でfieldは上書きされる

※判定条件と返り値は以下の関数を参照 :(下に書く) https://github.com/nodejs/node/blob/master/lib/_http_incoming.js#L150

fieldの1文字目を判定用のフラグとして扱う。

flagは以下の場合で場合分けされる

- 0か2の場合
- 1の場合
- 上記以外で、dest[field]が存在しない場合

#### 0か2の場合

判定用のflag分の文字をsliceでカットし
dest[field]が既に存在する場合(stringの場合)
　flagが0ならカンマ(,)で、そうでなければ（2なら）セミコロン(;)でdest[field]に値を追加する
そうではない場合（dest[field]が存在しない場合）dest[field]にvalueを追加する。

```
ex) 0の場合

$ grep -r "0000" ./_http_incoming.js
./_http_incoming.js:        return '\u0000transfer-encoding';
./_http_incoming.js:        return '\u0000date';
./_http_incoming.js:        return '\u0000connection';
./_http_incoming.js:        return '\u0000cache-control';
./_http_incoming.js:        return '\u0000vary';
./_http_incoming.js:        return '\u0000content-encoding';
./_http_incoming.js:        return '\u0000origin';
./_http_incoming.js:        return '\u0000upgrade';
./_http_incoming.js:        return '\u0000expect';
./_http_incoming.js:        return '\u0000if-match';
./_http_incoming.js:        return '\u0000if-none-match';
./_http_incoming.js:        return '\u0000accept';
./_http_incoming.js:        return '\u0000accept-encoding';
./_http_incoming.js:        return '\u0000accept-language';
./_http_incoming.js:        return '\u0000x-forwarded-for';
./_http_incoming.js:        return '\u0000x-forwarded-host';
./_http_incoming.js:        return '\u0000x-forwarded-proto';
./_http_incoming.js:          return '\u0000' + field;

ex)2の場合
$ grep -r "0002" ./_http_incoming.js
./_http_incoming.js:        return '\u0002cookie';

```

#### 1の場合

1の場合は以下の通りset-cookie時のみのため、条件文も専用になっている

dest['set-cookie']が存在している場合（undefinedじゃない場合）
dest['set-cookie']に値(value)をpushする。
そうじゃない場合（存在しない場合）
dest['set-cookie']に配列としてvalueを追加する


```
ex) 1の場合はset-cookie時のみ

$ grep -r "0001" ./_http_incoming.js
./_http_incoming.js:        return '\u0001';


case 'Set-Cookie':
case 'set-cookie':
  return '\u0001';

```

#### 上記以外で、dest[field]が存在しない場合

この場合はdest[field]にvalueを格納する。
以降undefinedにはならないので、コメントの通り`we declare the first instance the  winner and drop the second`となる




## RFC2616 の section 4.2

#### 参考

原文:https://tools.ietf.org/html/rfc2616#section-4.2
日本語訳: https://triple-underscore.github.io/RFC2616-ja.html#section-4.2

```
HTTP header fields, which include general-header (section 4.5),
   request-header (section 5.3), response-header (section 6.2), and
   entity-header (section 7.1) fields, follow the same generic format as
   that given in Section 3.1 of RFC 822 [9]. Each header field consists
   of a name followed by a colon (":") and the field value. Field names
   are case-insensitive. The field value MAY be preceded by any amount
   of LWS, though a single SP is preferred. Header fields can be
   extended over multiple lines by preceding each extra line with at
   least one SP or HT. Applications ought to follow "common form", where
   one is known or indicated, when generating HTTP constructs, since
   there might exist some implementations that fail to accept anything


   beyond the common forms.

         message-header = field-name ":" [ field-value ]
         field-name     = token
         field-value    = *( field-content | LWS )
         field-content  = <the OCTETs making up the field-value
                          and consisting of either *TEXT or combinations
                          of token, separators, and quoted-string>

     The field-content does not include any leading or trailing LWS:
     linear white space occurring before the first non-whitespace
     character of the field-value or after the last non-whitespace
     character of the field-value. Such leading or trailing LWS MAY be
     removed without changing the semantics of the field value. Any LWS
     that occurs between field-content MAY be replaced with a single SP
     before interpreting the field value or forwarding the message
     downstream.

     The order in which header fields with differing field names are
     received is not significant. However, it is "good practice" to send
     general-header fields first, followed by request-header or response-
     header fields, and ending with the entity-header fields.

     Multiple message-header fields with the same field-name MAY be
     present in a message if and only if the entire field-value for that
     header field is defined as a comma-separated list [i.e., #(values)].
     It MUST be possible to combine the multiple header fields into one
     "field-name: field-value" pair, without changing the semantics of the
     message, by appending each subsequent field-value to the first, each
     separated by a comma. The order in which header fields with the same
     field-name are received is therefore significant to the
     interpretation of the combined field value, and thus a proxy MUST NOT
     change the order of these field values when a message is forwarded.



   一般ヘッダ (section 4.5)、リクエストヘッダ (section 5.3)、レスポンスヘッダ (section 6.2)、エンティティヘッダ (section 7.1) 各フィールドを含む HTTP ヘッダフィールドは、RFC 822 [9] の Section 3.1 で与えられているものと同じである共通のフォーマットに従う。 それぞれのヘッダフィールドは、名前、その後にコロン(":")、そしてフィールド値から成る。 フィールド名は、大文字・小文字を区別しない。 フィールド値には、いくつもの LWS を先行させる事ができるが、SP 一つだけが好ましい。 ヘッダフィールドは、一つ以上の SP や HT をそれぞれの行頭につける事で複数行にまたがる事ができる。 アプリケーションが HTTP 構造を生成する時には、"共通形式" を超えたものは受け入れられない実装がいくつか存在するであろう事を考慮し、知られている、あるいは示されている "共通形式"に従うべきである。

   message-header = field-name ":" [ field-value ]
   field-name     = token
   field-value    = *( field-content | LWS )
   field-content  = <field-value を構成し、*TEXT あるいは
                    token, separators, quoted-string を連結
                    したものから成る OCTET>
  field-content は、LWS を前にも後ろにも、すなわち field-value の最初の空白以外の文字の前にも、あるいは field-value の最後の空白以外の文字の後ろにも、含まない。 そのような前後の LWS は、フィールド値の意味論を変える事無く削除されるであろう。 field-content の間のいかなる LWS もフィールド値に解釈されたり、下流{downstream} に転送される前に単なる SP に置き換えられるであろう。

  異なるフィールド名を持つヘッダフィールドが受信される順序は、重要ではない。 しかしながら、最初に一般ヘッダフィールド、その後にリクエストヘッダやレスポンスヘッダ、そして最後にエンティティフィールドを送る事が "良い習慣" である。

  同じフィールド名を持つ複数のメッセージヘッダフィールドは、そのヘッダフィールドの全体のフィールド値が [例えば、#(value) のように] コンマで区切られたリストとして定義される場合にのみ、メッセージに存在できる。 そしてそれら複数のヘッダフィールドは、最初の field-value に、コンマによって分けられたそれぞれの field-value を追加する事で、メッセージの意味論を変える事無しに、一つの "header-name: header-value" ペアに結合できなければならない。 それゆえ、同じフィールド名のヘッダフィールドが受信される順番は、連結されたフィールド値の中間処理のために重要なので、プロクシはメッセージを転送する時にはそれらのヘッダ値の順番を変えてはならない。

```

※ LWS = Linear White Space




### matchKnownFields


``` javascript
// This function is used to help avoid the lowercasing of a field name if it
// matches a 'traditional cased' version of a field name. It then returns the
// lowercased name to both avoid calling toLowerCase() a second time and to
// indicate whether the field was a 'no duplicates' field. If a field is not a
// 'no duplicates' field, a `0` byte is prepended as a flag. The one exception
// to this is the Set-Cookie header which is indicated by a `1` byte flag, since
// it is an 'array' field and thus is treated differently in _addHeaderLines().
// TODO: perhaps http_parser could be returning both raw and lowercased versions
// of known header names to avoid us having to call toLowerCase() for those
// headers.

// 'array' header list is taken from:
// https://mxr.mozilla.org/mozilla/source/netwerk/protocol/http/src/nsHttpHeaderArray.cpp

```

この関数は、フィールド名が小文字と伝統的なフィールド名の場合とで一致した場合に、合わせるのに役立ちます


その時、小文字のパターンのフィールド名を返し、その時にtoLowerCase()を再度呼び出すことを避け、重複したフィールドにならないようにします。

重複しないフィールドの場合、0byteがフラグとして追加されます。

例外として、set-cookieヘッダの場合、1 byteフラグとして示され、arrayフィールドとして扱い、_addHeaderLinesでは別ものとして扱います。

TODO: http_parserはおそらく、それらのヘッダーに対して、toLowerCaseを呼び出すのを避けるために、既知のヘッダー名は生と小文字版の2つとも返す可能性はあります。



'array'ヘッダリストは以下のURLから与えられています https://mxr.mozilla.org/mozilla/source/netwerk/protocol/http/src/nsHttpHeaderArray.cpp

-> 移転したっぽい

https://dxr.mozilla.org/mozilla/source/netwerk/protocol/http/src/nsHttpHeaderArray.cpp

hotlinkするなってかいてある...でもgithubのやつはコードがちょっと違う…


### arrayのリスト比較

mozillaのはココ??
https://dxr.mozilla.org/mozilla/source/netwerk/protocol/http/src/nsHttpHeaderArray.cpp#252

```
nsHttpHeaderArray::CanAppendToHeader(nsHttpAtom header)
{
    return header != nsHttp::Content_Type        &&
           header != nsHttp::Content_Length      &&
           header != nsHttp::User_Agent          &&
           header != nsHttp::Referer             &&
           header != nsHttp::Host                &&
           header != nsHttp::Authorization       &&
           header != nsHttp::Proxy_Authorization &&
           header != nsHttp::If_Modified_Since   &&
           header != nsHttp::If_Unmodified_Since &&
           header != nsHttp::From                &&
           header != nsHttp::Location            &&
           header != nsHttp::Max_Forwards;
}
```


matchKnownFieldsが返す値

```
return 'content-type';
return 'content-length';
return 'user-agent';
return 'referer';
return 'host';
return 'authorization';
return 'proxy-authorization';
return 'if-modified-since';
return 'if-unmodified-since';
return 'from';
return 'location';
return 'max-forwards';
return 'retry-after';
return 'etag';
return 'last-modified';
return 'server';
return 'age';
return 'expires';
return '\u0001';
return '\u0002cookie';
return '\u0000transfer-encoding';
return '\u0000date';
return '\u0000connection';
return '\u0000cache-control';
return '\u0000vary';
return '\u0000content-encoding';
return '\u0000origin';
return '\u0000upgrade';
return '\u0000expect';
return '\u0000if-match';
return '\u0000if-none-match';
return '\u0000accept';
return '\u0000accept-encoding';
return '\u0000accept-language';
return '\u0000x-forwarded-for';
return '\u0000x-forwarded-host';
return '\u0000x-forwarded-proto';
  return '\u0000' + field;
```



diff
```
return 'content-type'; // ある
return 'content-length'; // ある
return 'user-agent'; // ある
return 'referer'; // ある
return 'host';  // ある
return 'authorization'; // ある
return 'proxy-authorization'; // ある
return 'if-modified-since'; // ある
return 'if-unmodified-since'; // ある
return 'from'; // ある
return 'location'; // ある
return 'max-forwards'; // ある

---- 以下はない ----
return 'retry-after';
return 'etag';
return 'last-modified';
return 'server';
return 'age';
return 'expires';
return '\u0001';
return '\u0002cookie';
return '\u0000transfer-encoding';
return '\u0000date';
return '\u0000connection';
return '\u0000cache-control';
return '\u0000vary';
return '\u0000content-encoding';
return '\u0000origin';
return '\u0000upgrade';
return '\u0000expect';
return '\u0000if-match';
return '\u0000if-none-match';
return '\u0000accept';
return '\u0000accept-encoding';
return '\u0000accept-language';
return '\u0000x-forwarded-for';
return '\u0000x-forwarded-host';
return '\u0000x-forwarded-proto';
return '\u0000' + field;

```

### 謎
https://github.com/daleharvey/mozilla-central/blob/master/netwerk/protocol/http/nsHttpHeaderArray.cpp

とmxrのコードが違う・・・（おんなじやつっぽいのに）

netwerk ??? (network??)
