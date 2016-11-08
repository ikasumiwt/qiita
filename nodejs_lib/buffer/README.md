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
> 最初の引数としてstring,array,bufferを渡した時、Bufferの中の渡されたオブジェクトデータとしてコピーされる
> Passing a string, array, or Buffer as the first argument copies the passed object's data into the Buffer.

はBufferに格納されるということであっている…？

----------

ArrayBufferを渡した場合、渡したArrayBufferがメモリ空間に割り当てられて返される。

コード的には[このへん](https://github.com/nodejs/node/blob/v6.9.1-proposal/lib/buffer.js#L95)

返されるのはreturn new FastBuffer(obj, byteOffset, length);

----------
new Buffer()に渡す引数が適切にバリデートされていないアプリケーションや、新しく割り当てられたバッファのcontentが適切な初期化がされていない場合は失敗する (など？)
最初の引数に渡した値(value)の種類によって、new Buffer()の挙動が大幅に変更されたため、
コードにセキュリティと信頼性を導入することができる(inadvertentry?)


> 翻訳できぬ
> applications that do not properly validate the input arguments passed to new Buffer(), or that fail to appropriately initialize newly allocated Buffer content


Bufferのインスタンスを作るときに new Buffer()は非推奨なので Buffer.from()とかBuffer.alloc()とかBuffer.allocUnsafe()とかに置き換えてね！

開発者はnew Buffer()使っていたらこれらの新しいAPIに以降すべきです
> Developers should migrate all existing uses of the new Buffer() constructors to one of these new APIs.


------

- Buffer.from(array)
arrayの8bitのcopyを含む新しいBufferを返す

- Buffer.from(arrayBuffer[, byteOffset [, length]])

与えられたArrayBufferと同じメモリ空間に割り当てた新しいBufferを返す (?)


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


------------

Buffer.allocUnsafe()によって返されるBufferのインスタンスは　サイズがBuffer.poolSizeの半分以下の場合、内部のメモリプールを割り当てることができる

Buffer.allocUnsafeSlow()によって返されるBufferのインスタンスは内部のメモリプールを一切使うことはありません。


#### Buffers and Character Encodings
Buffer instances are commonly used to represent sequences of encoded characters such as UTF-8, UCS2, Base64 or even Hex-encoded data. It is possible to convert back and forth between Buffer instances and ordinary JavaScript strings by using an explicit character encoding.

Example:

const buf = Buffer.from('hello world', 'ascii');

// Prints: 68656c6c6f20776f726c64
console.log(buf.toString('hex'));

// Prints: aGVsbG8gd29ybGQ=
console.log(buf.toString('base64'));


#### Buffers and TypedArray

Buffer instances are also Uint8Array instances. However, there are subtle incompatibilities with the TypedArray specification in ECMAScript 2015. For example, while ArrayBuffer#slice() creates a copy of the slice, the implementation of Buffer#slice() creates a view over the existing Buffer without copying, making Buffer#slice() far more efficient.

#### Buffers and ES6 iteration


#### Class: Buffer
