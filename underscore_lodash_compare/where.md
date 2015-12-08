underscoreコードリーディング（where）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##whereとは


###[underscorejs.orgのwhere](http://underscorejs.org/#where)

こんな説明。
>####_.where(list, properties) 
>Looks through each value in the list, returning an array of all the values that contain all of the key-value pairs listed in properties.


```javascript
_.where(listOfPlays, {author: "Shakespeare", year: 1611});
=> [{title: "Cymbeline", author: "Shakespeare", year: 1611},
    {title: "The Tempest", author: "Shakespeare", year: 1611}]

```

------------- 


###[underscore.where](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L288)
コード的にはこのあたり。

```javascript
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };
```

