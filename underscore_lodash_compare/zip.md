underscoreコードリーディング（zip）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##withoutとは


###[underscorejs.orgのzip](http://underscorejs.org/#zip)

こんな説明。
>####_.zip(*arrays) 
Merges together the values of each of the arrays with the values at the corresponding position. Useful when you have separate data sources that are coordinated through matching array indexes. If you're working with a matrix of nested arrays, _.zip.apply can transpose the matrix in a similar fashion.


```javascript

_.zip(['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]);
=> [["moe", 30, true], ["larry", 40, false], ["curly", 50, false]]

```
------------- 



###[underscore.zip](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L580)
コード的にはこのあたり。

```javascript
  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

```


