underscoreコードリーディング（max）


underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##maxとは


###[underscorejs.orgのmax](http://underscorejs.org/#max)

こんな説明。
>####_.max(list, [iteratee], [context]) 
>Returns the maximum value in list. 
>If an iteratee function is provided, it will be used on each value to generate the criterion by which the value is ranked.
>-Infinity is returned if list is empty, so an isEmpty guard may be required.

```javascript
var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
_.max(stooges, function(stooge){ return stooge.age; });
=> {name: 'curly', age: 60};

```

------------- 

listの中の最大値を返す
もしiteratee関数が渡されていたら、その関数がすべての値に対して、ランク付けする際に利用される
-Infinityはlistが空の場合に渡される。なので、isEmptyで先にガードしなければならない。


例示だとstooge.ageをmaxの値に利用している



###[underscore.max](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L298)

コード的にはこのあたり。

```javascript
  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };
```
最初にresult,lastComputedに -Infinityをセットしている。
_.mapの中で_.property(key)に合致する値のみをreturnする。
iterateeが存在せず、objが存在する場合には、objがArrayか連想配列か判定し、
その中で値の比較を行っている。値は単純に比較されて、最も大きな値がresultに格納され、returnされる。

それ以外の場合（iterateeが存在するか、objがnullな場合か、その両方）は
iterateeを用いて_.eachを用いて比較している。
比較方法はobjそれぞれの値(value)に対して、iterateeの値がlastComputedを超えているか、もしくはcomputedが-Infinityだった場合はresultにvalueを格納している（例だと{name: 'larry', age: 50}のような値）
また、lastComputedには50のような値を格納して、_.eachが終わるまで比較する

比較後、resultを返す。
