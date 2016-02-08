underscoreコードリーディング（keys）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##invertとは


###[underscorejs.orgのinvert](http://underscorejs.org/#invert)

こんな説明。
>####_.invert(object) 
>Returns a copy of the object where the keys have become the values and the values the keys. 
>For this to work, all of your object's values should be unique and string serializable.


```javascript
_.invert({Moe: "Moses", Larry: "Louis", Curly: "Jerome"});
=> {Moses: "Moe", Louis: "Larry", Jerome: "Curly"};

```
------------- 


###[underscore.compose](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L863)
コード的にはこのあたり。

```javascript
  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };
```
