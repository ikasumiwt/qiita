underscoreコードリーディング（flatten）


underscoreに詳しくないので、勉強半分でソースコードを読む。


##利用するバージョン
[underscore.js(v1.8.3)](https://github.com/jashkenas/underscore/tree/1.8.3)


##flattenとは



###[underscorejs.orgのflatten](http://underscorejs.org/#flatten)

こんな説明。
>####_.flatten(array, [shallow]) 
>Flattens a nested array (the nesting can be to any depth). 
>If you pass shallow, the array will only be flattened a single level.


```javascript

_.flatten([1, [2], [3, [[4]]]]);
=> [1, 2, 3, 4];

_.flatten([1, [2], [3, [[4]]]], true);
=> [1, 2, 3, [[4]]];

```

------------- 
ネスト化された配列をフラットにします。（ネスト化されている深さはどれだけでもです）
もしshallowを渡された場合、フラット化されるのは1階層のみです。


###[underscore.flatten](https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L509)

コード的にはこのあたり。


```javascript

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

```
_.flattenはflatten関数にarrayとshallow,falseを渡すのみ。
flattenはinput(array)に対してinput.lengthまでfor文を回す。
配列の中の値(value)がisArrayLikeに合致していて、かつisArrayもしくはisArgumentsに当てはまる場合は
shallowがtrueでない場合は再帰的にflatten関数に値を受け渡す。
outputのlengthにvalueのlengthを足し合わせる。
その上で現在のoutputの位置であるidxをインクリメントしながらoutputのidx番目にvalueを格納する。
配列の中の値(value)がisArrayLikeに合致していて、かつisArrayもしくはisArgumentsに当てはまらない場合（かつstrictがない場合）は、outputのidx番目にvalueを格納する。後置なので、格納後にidxをインクリメントする。
