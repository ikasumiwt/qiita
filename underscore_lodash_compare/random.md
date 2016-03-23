underscoreコードリーディング（random）

underscoreに詳しくないので、勉強半分でソースコードを読む。



##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##randomとは


###[underscorejs.orgのrandom](http://underscorejs.org/#random)

こんな説明。
>####_.random(min, max) 
>Returns a random integer between min and max, inclusive.
>If you only pass one argument, it will return a number between 0 and that number.


```javascript
_.random(0, 100);
=> 42

```

------------- 
引数にあるminとmaxお間のintegerをランダムで返します。
もし1つしか引数を渡さなかった場合、0からその値までの間のランダムな値を返します。

###[underscore.random](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1321)
コード的にはこのあたり。

```javascript
  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };
```

maxがnullの場合はminをmaxにして、minを0にする。
その後、 Math.randomのmax - min + 1の間の中の値をfloorで整数化したものとminを足し合わせたものを返す。
