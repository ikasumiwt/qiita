underscoreコードリーディング（bindAll）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##とは


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
methodNamesは必須です。

###[underscore.](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L738)
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
