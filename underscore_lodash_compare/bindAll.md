underscoreコードリーディング（bindAll）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##bindAllとは


###[underscorejs.orgのbindAll](http://underscorejs.org/#bindAll)

こんな説明。
>####_.bindAll(object, *methodNames) 
>Binds a number of methods on the object, specified by methodNames, to be run in the context of that object whenever they are invoked.
>Very handy for binding functions that are going to be used as event handlers, which would otherwise be invoked with a fairly useless this.
>methodNames are required.


```javascript
var buttonView = {
  label  : 'underscore',
  onClick: function(){ alert('clicked: ' + this.label); },
  onHover: function(){ console.log('hovering: ' + this.label); }
};
_.bindAll(buttonView, 'onClick', 'onHover');
// When the button is clicked, this.label will have the correct value.
jQuery('#underscore_button').bind('click', buttonView.onClick);
```
------------- 
methodNamesに指定されたいくつかのメソッドを、objectが呼び出された時にそのコンテキストで実行されるように、objectに対して紐付けます。
イベントハンドラとして利用する際に、関数を紐付けるのにとても扱いやすいです。
イベントハンドラとして利用しようとするには、バインドするのにとても使いやすいですが、それ以外の場合は無用に呼び出されるだけなので全然使い勝手が良くないです。
methodNamesは必須です。

###[underscore.bindAll](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L738)
コード的にはこのあたり。

```javascript
 // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

```

第一引数のobj以外のargumentsの長さを求めてlengthに入れておく。
lengthが1以下だった場合エラーを返す（methodNameがないことになるので）
1以上の場合、_.bindを用いてobjにバインドしていく。その後、バインドされたobjを返却する。
