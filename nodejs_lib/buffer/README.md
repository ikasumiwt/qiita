# notes
https://github.com/nodejs/node/blob/v6.9.1-proposal/lib/buffer.js の読み物です。

## Node.js v6.9.1 Documentation

[docs](https://nodejs.org/dist/latest-v6.x/docs/api/buffer.html)

### buffer
ECMAScript2015(ES6)で導入される[TypedArray](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)がないころはJavaScriptではバイナリデータのストリームを読み取る/処理する機能を有していませんでした。

BufferクラスはNode.jsのAPIの一つで、[octet-stream](https://wiki.suikawiki.org/n/application%2Foctet-stream)
と相互に作用し、TCPストリームやファイルシステムの操作を可能にするために導入されました。


今はES6でTypedArrayが導入されたことにより、BufferクラスはUinit8Array APIが実装され、ある意味? Node.jsのユースケースに適切な形になっています。

Bufferクラスのインスタンスは、整数の配列に似ているが、固定長に対応しV8ヒープの外のraw memory allocationに対応しています(?)
//but correspond to fixed-sized, raw memory allocations outside the V8 heap.
Bufferのサイズは生成された際に確定され、そのサイズは変更できません。

Node.jsではBufferクラスはグローバルで存在するので、普通は
require('buffer').Bufferはいらないです。


Ex.)

```
// Creates a zero-filled Buffer of length 10.
const buf1 = Buffer.alloc(10);

// Creates a Buffer of length 10, filled with 0x1.
const buf2 = Buffer.alloc(10, 1);

// Creates an uninitialized buffer of length 10.
// This is faster than calling Buffer.alloc() but the returned
// Buffer instance might contain old data that needs to be
// overwritten using either fill() or write().
const buf3 = Buffer.allocUnsafe(10);

// Creates a Buffer containing [0x1, 0x2, 0x3].
const buf4 = Buffer.from([1, 2, 3]);

// Creates a Buffer containing ASCII bytes [0x74, 0x65, 0x73, 0x74].
const buf5 = Buffer.from('test');

// Creates a Buffer containing UTF-8 bytes [0x74, 0xc3, 0xa9, 0x73, 0x74].
const buf6 = Buffer.from('tést', 'utf8');
```


#### Buffer.from(), Buffer.alloc(), and Buffer.allocUnsafe()

Node.jsのversion 6以前では、Bufferのインスタンスは、
どんな引数が与えられていてもBufferが返されるように割り当てられてるようになっていた
Bufferのコンストラクタ関数を用いて作られていた。(?)
// Buffer instances were created using the Buffer constructor function, which allocates the returned Buffer differently based on what arguments are provided:

- 第一引数に数値を渡すと、指定されたサイズの新しいBufferオブジェクトを割り当てます。
(こんなかんじに: new Buffer(10))

-----------
このようにメモリが初期化されていない状態で生成されたBufferインスタンスは、機密データを含むことができます。
このようなBufferインスタンスはbuf.fill(0)やBufferに完全に書き込むことで手動で初期化する必要があります。

この動作は、パフォーマンスを向上させるための意図的な動作ですが、開発経験上、初期化されていない高速なバッファを作成することと遅いけれど安全なバッファを作成することの明確な区別が求められていると証明（説明）されています

----------
最初の引数としてstring,array,bufferを渡した時、Bufferの中の渡されたオブジェクトデータとしてコピーされる

https://github.com/nodejs/node/blob/master/lib/buffer.js#L76
ここで
https://github.com/nodejs/node/blob/master/lib/buffer.js#L95
Buffer.fromが呼ばれて
https://github.com/nodejs/node/blob/master/lib/buffer.js#L106

数値だとBuffer.allocUnsafe or Error
array,shared arrayだったら fromArrayBuffer()
stringなら fromString()
それ以外なら fromObject()

試しにfromString()読む
->
 encodingが適切じゃなかったらエラー
 stringのlengthが0だったら FastBufferをnew
  if (length >= (Buffer.poolSize >>> 1)) だったらbinding.createFromStringしてreturn(bindingはprocess.binding('buffer') )
  ->何だこれと思ったら(大津さんの)資料にあたった…　http://html5.ohtsu.org/nodejuku01/nodejuku01_ohtsu.pdf

つまり、起動されているprocess objectをbindingしてbufferにつなぐ？
> 呼び出すモジュールがネイティブモジュールの場合 参照

bindingは https://github.com/nodejs/node/blob/1a55e9a5672ec654a6cfdd694c20b7067368f5e9/src/node.cc#L3331 ?
で https://github.com/nodejs/node/blob/1a55e9a5672ec654a6cfdd694c20b7067368f5e9/src/node.cc#L2563
キャッシュがあったらcacheのやつ返す？
~~ ここで力尽きる(余力があれば調べる)

続き#201
  if (length > (poolSize - poolOffset))だったら
  createPool()する
  Buffer.poolSizeは初期値では 8 * 1024,
  allocPoolはcreateUnsafeArrayBuffer(poolSize)なのでnew FastBuffer(8 * 1024) //前まではnew ArrayBuffer(8 * 1024)？

  [FastBuffer] (https://github.com/nodejs/node/blob/v6.9.1-proposal/lib/buffer.js#L9) は[Uint8Array](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)のextendsしたものなので
  allocPool = new Uint8Array(8*1024);

  createPool()を最初に実行しているので#49 poolOffsetは0,


  var actual = allocPool.write(string, poolOffset, encoding);
  は
>  #15
>  FastBuffer.prototype.constructor = Buffer;
>  Buffer.prototype = FastBuffer.prototype;
  なので
  https://github.com/nodejs/node/blob/v6.9.1-proposal/lib/buffer.js#L704 のBuffer.prototype.write

->  buffer.write(string, 0(=poolOffset), encoding)

> ※謎
> Buffer.prototype.write = function(string, offset, length, encoding) {
> なんだけど、lengthにencoding入ってないかなこれ…

utf-8だとすると
this.utf8Write(string, offset, length);
が返ってくる
utf8Writeは https://github.com/nodejs/node/blob/v6.9.1-proposal/src/node_buffer.cc#L711 これ


var b = allocPool.slice(poolOffset, poolOffset + actual);
同様に
https://github.com/nodejs/node/blob/v6.9.1-proposal/lib/buffer.js#L805
のBuffer.prototype.slice
  buffer.slice(0, 0 + actual)

poolOffset += actual; でpoolOffsetを増加

[alignPool()](https://github.com/nodejs/node/blob/v6.9.1-proposal/lib/buffer.js#L52)して
return bする

ーーここまで脱線

で、

最初の引数としてstring,array,bufferを渡した時、Bufferの中の渡されたオブジェクトデータとしてコピーされる
----------

ArrayBufferを渡した場合、渡したArrayBufferがメモリ空間に割り当てられて返される。

コード的には[このへん](https://github.com/nodejs/node/blob/v6.9.1-proposal/lib/buffer.js#L95)

返されるのはreturn new FastBuffer(obj, byteOffset, length);

----------
new Buffer()に渡す引数が適切にバリデートされていないアプリケーションや、新しく割り当てられたバッファのcontentが適切な初期化がされていない場合は失敗する (など？)
最初の引数に渡した値(value)の種類によって、new Buffer()の挙動が大幅に変更されたため、
コードにセキュリティと信頼性を導入することができる(inadvertentry?)


Bufferのインスタンスを作るときに new Buffer()は非推奨なので Buffer.from()とかBuffer.alloc()とかBuffer.allocUnsafe()とかに置き換える必要がある

開発者はnew Buffer()使っていたらこれらの新しいAPIに移行すべきです
> Developers should migrate all existing uses of the new Buffer() constructors to one of these new APIs.


------

- Buffer.from(array)
arrayの8bitのcopyを含む新しいBufferを返す

- Buffer.from(arrayBuffer[, byteOffset [, length]])

与えられたArrayBufferと同じメモリ空間に割り当てた新しいBufferを返す


- Buffer.from(buffer)
与えられたBufferのcopyを含む新しいBufferを返す

- Buffer.from(string[, encoding])
与えられたstringのcopyを含む新しいBufferを返す


- Buffer.alloc(size[, fill[, encoding]])
指定されたsizeのfilled なBufferを返す。

このメソッドはallocUnsafeよりめっちゃ遅くなるけど新しく作成されたBufferインスタンスは古い、機密性のあるデータが含まれていないことを保証します。

- Buffer.allocUnsafe(size) &  Buffer.allocUnsafeSlow(size)
どちらも 指定されたsizeの新しいBufferを返す。
ただし、初期化されていないのでbuf.fill(0)か完全に上書きしてから使わないとだめです。

サンプルコード
Examples:)参考
src/alloc.js

------------

Buffer.allocUnsafe()によって返されるBufferのインスタンスは　サイズがBuffer.poolSizeの半分以下の場合、内部のメモリプールを割り当てることができる

Buffer.allocUnsafeSlow()によって返されるBufferのインスタンスは内部のメモリプールを一切使うことはありません。


##### --zero-fill-buffers コマンドラインオプション
(The --zero-fill-buffers command line option)
v5.10.0から追加

Node.jsは --zero-fill-buffersを用いて起動することができる。これによって、new Buffer,Buffer.allocUnsafe,Buffer.allocUnsafeSlow,new SlowBuffer などで新しく割り当てられるすべてのBufferは自動的に0フィルされます。

このフラグを使うと、↑のメソッドのデフォルトの動作を変更することになるので、パフォーマンスに大きな影響がでるかもしれません。

--zero-fill-buffers は、Bufferインスタンスに機密データを含んだメモリ空間が割り当てられる可能性がある場合のときのみ、使うことが推奨されます。

ex)
```
$ node --zero-fill-buffers
> Buffer.allocUnsafe(5);
<Buffer 00 00 00 00 00>
```

##### Buffer.allocUnsafeとBuffer.allocUnsafeSlowは何が安全じゃないのか
(What makes Buffer.allocUnsafe() and Buffer.allocUnsafeSlow() "unsafe"?)

Buffer.allocUnsafeとBuffer.allocUnsafeSlowが呼ばれる時、メモリの割り当てられたセグメントは初期化されていません（0フィルされてません)

この設計は、メモリの割当はとても早くなるけれど、メモリの割り当てられたセグメントは古いデータが含まれていて、可能性としては機密データの可能性もあります。

メモリを完全に上書きせずに、Buffer.allocUnsafeを用いてBufferを作成する場合、この古いデータが読み取ることができる可能性が残ります。

Buffer.allocUnsafe を用いるとパフォーマンスが向上するというメリットはありますが、アプリケーションのセキュリティ(脆弱性)には、より一層注意する必要があります。


####  バッファと文字コード
(Buffers and Character Encodings)

バッファのインスタンスは、シーケンスを表現するのにUTF-8, UCS2, Base64  Hex-encoded data.のような物がよく使われます
明示的にencodingを指定することでBufferのインスタンスとJavaScriptの文字列の間でコンバートできます

Example:
```
const buf = Buffer.from('hello world', 'ascii');

// Prints: 68656c6c6f20776f726c64
console.log(buf.toString('hex'));

// Prints: aGVsbG8gd29ybGQ=
console.log(buf.toString('base64'));


```

#### BuffersとTypedArray
(Buffers and TypedArray)

Bufferインスタンスは　Uint8Arrayのインスタンスです。[(参考)](https://github.com/nodejs/node/blob/v6.9.1-proposal/lib/buffer.js#L9)

しかし、ECMAScript 2015のTypedArrayの仕様とは微妙に互換性がないです。
例えば、ArrayBuffer#slice()はsliceのコピーを生成するけれど、
Buffer#sliceの実装は,既存のBufferのコピーなしで作成するので、Buffer#sliceのほうがはるかに効率的です。


次の点に注意すれば、Bufferから TypedArrayのインスタンスを作成することも出来ます。


1. バッファのオブジェクトのメモリはTypedArrayにコピーされ、シェアはされません。

2. バッファのオブジェクトのメモリは、異なる要素のArrayと解釈することができ(?)、ターゲットとなる方のバイトの配列としては解釈されません(?)
これは、
new Uint32Array(Buffer.from([1, 2, 3, 4]))は4つの要素として作られ、[0x1020304] or [0x4030201]みたいな一つの要素にはなりません

->試しに src/convertArr.js
```
let buf = Buffer.from([1,2,3]);
let arr = new Uint32Array(buf);

console.log( buf );
console.log( arr );
console.log( arr.length );
/* prints:
 <Buffer 01 02 03>
 Uint32Array [ 1, 2, 3 ]
 3 //not single elements
*/
```

TypeArrayオブジェクトの.buffer プロパティを用いることによって、TypedArrayインスタンスと同じ割り当てられたメモリを共有したnew Bufferを作成することが出来ます。

[.buffer](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/buffer)

ex)

```
const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Copies the contents of `arr`
const buf1 = Buffer.from(arr);

// Shares memory with `arr`
const buf2 = Buffer.from(arr.buffer);

// Prints: <Buffer 88 a0>
console.log(buf1);

// Prints: <Buffer 88 13 a0 0f>
console.log(buf2);

arr[1] = 6000;

// Prints: <Buffer 88 a0>
console.log(buf1);

// Prints: <Buffer 88 13 70 17>
console.log(buf2);
```

TypedArrayの .bufferを利用してBufferを作成する際、ArrayBufferのbyteOffsetとlengthのパラメータのみ利用可能です

ex)
```
const arr = new Uint16Array(20);
const buf = Buffer.from(arr.buffer, 0, 16);

// Prints: 16
console.log(buf.length);
```

Buffer.fromとTypedArray.fromは異なる実装とシグネチャを持っています。
具体的には、TypedArrayは、第二引数でマッピング関数を受け付けます。(??that is invoked on every element of the typed array)

ex) https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/from
```
// Using an arrow function as the map function to
// manipulate the elements
Float32Array.from([1, 2, 3], x => x + x);      
// Float32Array [ 2, 4, 6 ]
```

- TypedArray.from(source[, mapFn[, thisArg]])

Buffer.fromはマッピング関数持ってないです

- Buffer.from(array)
- Buffer.from(buffer)
- Buffer.from(arrayBuffer[, byteOffset [, length]])
- Buffer.from(string[, encoding])


#### BufferとES6イテレーション
(Buffers and ES6 iteration)

Bufferインスタンスは イテレートする際にfor..ofのシンタックスとかを使えます。

追記：
buf.values(),buf.keys(),buf.entries()のメソッドも使えます

ex) src/iterate.js
```
const buf = Buffer.from([1, 2, 3]);

// Prints:
//   1
//   2
//   3
for (var b of buf) {
  console.log(b);
}

console.log('-- buf.values');
// values
for(var a of buf.values()){
  console.log(a);
}

console.log('-- buf.values');

for(var a of buf.values()){
  console.log(a)
}
console.log('-- buf.keys');
for(var a of buf.keys()){
  console.log(a)
}

console.log('-- buf.entries');

for(var a of buf.entries()){
  console.log(a)
}

/*
prints:
1
2
3
-- buf.values
1
2
3
-- buf.values
1
2
3
-- buf.keys
0
1
2
-- buf.entries
[ 0, 1 ]
[ 1, 2 ]
[ 2, 3 ]
*/
```

#### Class: Buffer

Bufferクラスはバイナリデータを直接扱うのでグローバルです。
色んな方法で構築できます。

- new Buffer(array)
- new Buffer(buffer)
- new Buffer(arrayBuffer[, byteOffset [, length]])
- new Buffer(size)
- new Buffer(string[, encoding])

->depricatedなので Buffer.from()を使いましょう

- Class Method: Buffer.alloc(size[, fill[, encoding]])

v5.10.0から追加

size: new Bufferする際のlength
fill:fillする際の値。デフォルト0
encoding:fillするのが文字列のときのエンコードする名前。デフォルトutf8

```
const buf1 = Buffer.alloc(5);
const buf2 = Buffer.alloc(5, 'a');
const buf3 = Buffer.alloc(5, 'a', 'ASCII');


console.log( buf1 );
console.log( buf2 );
console.log( buf3 );
/*
prints:
<Buffer 00 00 00 00 00>
<Buffer 61 61 61 61 61>
<Buffer 61 61 61 61 61>
*/
```


- Class Method: Buffer.allocUnsafe(size)
- Class Method: Buffer.allocUnsafeSlow(size)
v5.10.0から追加

```
const buf = Buffer.allocUnsafe(5);

console.log(buf);
//prints: ex <Buffer 50 86 03 03 01> etc.
buf.fill(0);
//prints:
//<Buffer 00 00 00 00 00>
console.log(buf);
```

```
バッファの作成において予め確保されている共有メモリプールの領域を使用しても良い場合にはBuffer.allocUnsafe関数を使用し、使用してはならない場合にはBuffer.allocUnsafeSlow関数を使用します。
```
参考:http://info-i.net/buffer

- Class Method: Buffer.byteLength(string[, encoding])
v0.1.90から追加

文字列のbyte のlengthを返す
ex) src/buffer.byteLength.js
```
const length = Buffer.byteLength('aaa', 'utf-8');

console.log( length );
//prints: 3
```

- Class Method: Buffer.compare(buf1, buf2)
v0.11.13から追加
buf1とbuf2を比較する

ex) src/buffer.compare.js
```
const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const buf3 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log( Buffer.compare( buf1,buf2 ));
// -> 1
console.log( Buffer.compare( buf2,buf3 ));
// -> 0
console.log( Buffer.compare( buf2,buf1 ));
// -> -1
```

- Class Method: Buffer.concat(list[, totalLength])
v0.7.11から追加

ex) src/buffer.concat.js
```
const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

// Prints: 42
console.log(totalLength);

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

// Prints: <Buffer 00 00 00 00 ...>
console.log(bufA);

// Prints: 42
console.log(bufA.length);

```

- Class Method: Buffer.from(array)
- Class Method: Buffer.from(arrayBuffer[, byteOffset[, length]])
- Class Method: Buffer.from(buffer)
- Class Method: Buffer.from(string[, encoding])

```
// 1,2,3の配列からBufferを作る
const buf4 = Buffer.from([1, 2, 3]);
console.log( buf4 );
// -> <Buffer 01 02 03>$
// ASCII バイトを含んだバッファを作成する
//Creates a Buffer containing ASCII bytes [0x74, 0x65, 0x73, 0x74]
const buf5 = Buffer.from('test');

console.log( buf5 );
// -> <Buffer 74 65 73 74>

// UTF-8形式のバッファを作成する
// Creates a Buffer containing UTF-8 bytes [0x74, 0xc3, 0xa9, 0x73, 0x74]
const buf6 = Buffer.from('tést','utf8');

 console.log( buf6 );
// -> <Buffer 74 c3 a9 73 74>
```

- Class Method: Buffer.isBuffer(obj)
v0.1.101から追加
bufferかどうかtrue/false返す

- Class Method: Buffer.isEncoding(encoding)
v0.9.1から追加

encoding可能なものかどうかチェック
```
let isEncoding = Buffer.isEncoding('utf8');

console.log(isEncoding);
// -> true
isEncoding = Buffer.isEncoding('hogehoge');
console.log(isEncoding);
// -> false
```

- Class Property: Buffer.poolSize
v0.11.3 から追加
デフォルトは8192(8 * 1024)
これ -> https://github.com/nodejs/node/blob/v6.9.1-proposal/lib/buffer.js#L26

事前に確保してあるbytes。
この値は変更しても良い。

- buf[index]

ex)

```
const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length ; i++) {
  buf[i] = str.charCodeAt(i);
}

// Prints: Node.js
console.log(buf.toString('ascii'));
```

- buf.compare(target[, targetStart[, targetEnd[, sourceStart[, sourceEnd]]]])

Buffer.compareとほぼ同じ・・・？

- buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])
ex) src/buffer.copy.js
```
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0 ; i < 26 ; i++) {
  // 97 is the decimal ASCII value for 'a'
  buf1[i] = i + 97;
 }

//prints: abcdefghijklmnopqrstuvwxy
console.log(buf1.toString('ascii', 0, 25));
buf1.copy(buf2, 8, 16, 20);
//qrstをbuf2のbuf2[8]~の箇所に コピー
// Prints: !!!!!!!!qrst!!!!!!!!!!!!!
console.log(buf2.toString('ascii', 0, 25));
```

- buf.entries()
v1.1.0から追加

```
const buf = Buffer.from('buffer');

// Prints:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
for (var pair of buf.entries()) {
  console.log(pair);
}
```

- buf.equals(otherBuffer)
v0.11.13から追加

比較してbooleanを返す。

```
const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

// Prints: true
console.log(buf1.equals(buf2));

// Prints: false
console.log(buf1.equals(buf3));
```


- buf.fill(value[, offset[, end]][, encoding])
v0.5.0から追加

```
const b = Buffer.allocUnsafe(50).fill('h');

// Prints: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
console.log(b.toString());
```

- buf.indexOf(value[, byteOffset][, encoding])
v1.5.0から追加

ex)
```
const buf = Buffer.from('this is a buffer');

// Prints: 0
console.log(buf.indexOf('this')));

// Prints: 2
console.log(buf.indexOf('is'));

// Prints: 8
console.log(buf.indexOf(Buffer.from('a buffer')));

// Prints: 8
// (97 is the decimal ASCII value for 'a')
console.log(buf.indexOf(97));

// Prints: -1
console.log(buf.indexOf(Buffer.from('a buffer example')));

// Prints: 8
console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));


const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'ucs2');

// Prints: 4
console.log(utf16Buffer.indexOf('\u03a3', 0, 'ucs2'));

// Prints: 6
console.log(utf16Buffer.indexOf('\u03a3', -4, 'ucs2'));

```

- buf.includes(value[, byteOffset][, encoding])
v5.3.0から追加

```
const buf = Buffer.from('this is a buffer');

// Prints: true
console.log(buf.includes('this'));

// Prints: true
console.log(buf.includes('is'));

// Prints: true
console.log(buf.includes(Buffer.from('a buffer')));

// Prints: true
// (97 is the decimal ASCII value for 'a')
console.log(buf.includes(97));

// Prints: false
console.log(buf.includes(Buffer.from('a buffer example')));

// Prints: true
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));

// Prints: false
console.log(buf.includes('this', 4));
```


- buf.keys()
v1.1.0から追加
返り値はiterator
```
const buf = Buffer.from('buffer');

// Prints:
//   0
//   1
//   2
//   3
//   4
//   5
for (var key of buf.keys()) {
  console.log(key);
}
```

- buf.lastIndexOf(value[, byteOffset][, encoding])
 v6.0.0から追加

```
const buf = Buffer.from('this buffer is a buffer');

// Prints: 0
console.log(buf.lastIndexOf('this'));

// Prints: 17
console.log(buf.lastIndexOf('buffer'));

// Prints: 17
console.log(buf.lastIndexOf(Buffer.from('buffer')));

// Prints: 15
// (97 is the decimal ASCII value for 'a')
console.log(buf.lastIndexOf(97));

// Prints: -1
console.log(buf.lastIndexOf(Buffer.from('yolo')));

// Prints: 5
console.log(buf.lastIndexOf('buffer', 5));

// Prints: -1
console.log(buf.lastIndexOf('buffer', 4));


const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'ucs2');

// Prints: 6
console.log(utf16Buffer.lastIndexOf('\u03a3', null, 'ucs2'));

// Prints: 4
console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'ucs2'));
```

- buf.length
v0.1.90から追加
bufferのlengthを返す
```
const buf = Buffer.alloc(1234);

// Prints: 1234
console.log(buf.length);

buf.write('some string', 0, 'ascii');

// Prints: 1234
console.log(buf.length);
```

- buf.readDoubleBE(offset[, noAssert])
- buf.readDoubleLE(offset[, noAssert])
- buf.readFloatBE(offset[, noAssert])
- buf.readFloatLE(offset[, noAssert])
- buf.readInt8(offset[, noAssert])
- buf.readInt16BE(offset[, noAssert])
- buf.readInt16LE(offset[, noAssert])
- buf.readInt32BE(offset[, noAssert])
- buf.readInt32LE(offset[, noAssert])
- buf.readIntBE(offset, byteLength[, noAssert])
- buf.readIntLE(offset, byteLength[, noAssert])
- buf.readUInt8(offset[, noAssert])
- buf.readUInt16BE(offset[, noAssert])
- buf.readUInt16LE(offset[, noAssert])
- buf.readUInt32BE(offset[, noAssert])
- buf.readUInt32LE(offset[, noAssert])
- buf.readUIntBE(offset, byteLength[, noAssert])
- buf.readUIntLE(offset, byteLength[, noAssert])

単精度、倍精度、8bit/16bit/32bit リトルエンディアン/ビッグエンディアンで読み取るメソッド
offsetは取得するデータの位置

- buf.slice([start[, end]])
- buf.swap16()
- bu- f.swap32()
- bu- f.swap64()
- bu- f.toString([encoding[, start[, end]]])
- buf.toJSON()
- buf.values()

- buf.write(string[, offset[, length]][, encoding])
- buf.writeDoubleBE(value, offset[, noAssert])
- buf.writeDoubleLE(value, offset[, noAssert])
- buf.writeFloatBE(value, offset[, noAssert])
- buf.writeFloatLE(value, offset[, noAssert])
- buf.writeInt8(value, offset[, noAssert])
- buf.writeInt16BE(value, offset[, noAssert])
- buf.writeInt16LE(value, offset[, noAssert])
- buf.writeInt32BE(value, offset[, noAssert])
- buf.writeInt32LE(value, offset[, noAssert])
- buf.writeIntBE(value, offset, byteLength[, noAssert])
- buf.writeIntLE(value, offset, byteLength[, noAssert])
- buf.writeUInt8(value, offset[, noAssert])
- buf.writeUInt16BE(value, offset[, noAssert])
- buf.writeUInt16LE(value, offset[, noAssert])
- buf.writeUInt32BE(value, offset[, noAssert])
- buf.writeUInt32LE(value, offset[, noAssert])
- buf.writeUIntBE(value, offset, byteLength[, noAssert])
- buf.writeUIntLE(value, offset, byteLength[, noAssert])
単精度、倍精度、8bit/16bit/32bit リトルエンディアン/ビッグエンディアンで書き込むメソッド

#### buffer.INSPECT_MAX_BYTES

v0.5.4から追加
デフォルトは50

buf.inspect()が呼ばれた際に返すバイト数の大きさ。
ユーザモジュールよって上書きすることが可能。
util.instpect()に詳細がある。

これは、bufferモジュールやそのインスタンスが返すのではなく、 require('buffer')によって返されます


#### buffer.kMaxLength
v3.0.0から追加

バッファインスタンスが許容できる最大のサイズ

32Bitのアーキテクチャではこの値は (2^30)-1 (~1GB)64Bitのアーキテクチャでは(2^31)-1 (~2GB)となる。

#### Class: SlowBuffer
- new SlowBuffer(size)
Deprecated since: v6.0.0
非推奨
-> Buffer.allocUnsafeSlowを使いましょう



#### 参考
http://html5.ohtsu.org/nodejuku01/nodejuku01_ohtsu.pdf
http://www.slideshare.net/shigeki_ohtsu/processnext-tick-nodejs
http://info-i.net/buffer
