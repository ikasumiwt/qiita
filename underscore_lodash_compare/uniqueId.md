underscoreコードリーディング（uniqueId）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##uniqueIdとは


###[underscorejs.orgのuniqueId](http://underscorejs.org/#uniqueId)

こんな説明。
>####_.uniqueId([prefix]) 
>Generate a globally-unique id for client-side models or DOM elements that need one.
>If prefix is passed, the id will be appended to it.


```javascript

_.uniqueId('contact_');
=> 'contact_104'

```

------------- 
クライアントサイドのモデルやDOMで必要なグローバルなユニークIDを生成します。
prefixが渡された場合、それをIDの前につけます

###[underscore.uniqueId](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1373)
コード的にはこのあたり。

```javascript
  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };
```
idCounterを0で定義します。
idをidCounterを前置インクリメントしたものをStringで代入します。
prefixがある場合はprefix+idを、ない場合はidのみを返します。
