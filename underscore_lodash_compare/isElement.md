underscoreコードリーディング（isElement）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##isElementとは


###[underscorejs.orgのisElement](http://underscorejs.org/#isElement)

こんな説明。
>####_.isElement(object) 
Returns true if object is a DOM element.

```javascript

_.isElement(jQuery('body')[0]);
=> true

```

------------- 
objectがDOMの要素だった場合trueを返します。

###[underscore.isElement](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1200)
コード的にはこのあたり。

```javascript
  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };
```

objが存在し、かつobjのnodeTypeが1と合致した場合、2重否定した結果を返す。
