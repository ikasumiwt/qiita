# notes
https://github.com/nodejs/node/tree/master/lib の読み物です。

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
