underscoreコードリーディング（object）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##objectとは


###[underscorejs.orgのobject](http://underscorejs.org/#object)

こんな説明。
>####_.object(list, [values]) 
>Converts arrays into objects.
>Pass either a single list of [key, value] pairs, or a list of keys, and a list of values.
>If duplicate keys exist, the last value wins.



```javascript

(例1)
_.object(['moe', 'larry', 'curly'], [30, 40, 50]);
=> {moe: 30, larry: 40, curly: 50}

(例2)
_.object([['moe', 30], ['larry', 40], ['curly', 50]]);
=> {moe: 30, larry: 40, curly: 50}

```
------------- 

配列をオブジェクトに変換します。
[key,value]の形の1つのリスト(例2の形)、もしくはkeysのリストとvaluesのリスト（例1の形）のどちらかの配列で渡します。
もしkeysの中で重複したものがあった場合は、最後のvalueが勝ちます。

###[underscore.object](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L598)
コード的にはこのあたり。

```javascript
  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };
```

結果用のobjectのresultを定義
listの配列の長さだけfor文を回す。
valuesが合った場合には、listのi番目をkeyに、valuesのi番目を格納する。
valuesがない場合(listの値が[key,value]の形のとき)は、listのi番目の1つ目の値をkeyに2つめの値を格納する。

その後、resultを返す。
