// 長さ10, 0フィルのバッファを作る
const buf1 = Buffer.alloc(10);

//console.log( buf1 );
// -> <Buffer 00 00 00 00 00 00 00 00 00 00>

// Creates a Buffer of length 10, filled with 0x1.
// 長さ10,0x1で埋めたバッファを作る
const buf2 = Buffer.alloc(10, 1);

//console.log( buf2 );
// -> <Buffer 01 01 01 01 01 01 01 01 01 01>

// Creates an uninitialized buffer of length 10.
// This is faster than calling Buffer.alloc() but the returned
// Buffer instance might contain old data that needs to be
// overwritten using either fill() or write().

// 長さ10のイニシャライズされていないバッファを作る
const buf3 = Buffer.allocUnsafe(10);

//console.log( buf3 );
// -> <Buffer 50 86 03 03 01 00 00 00 58 86> etc.

// 1,2,3の配列からBufferを作る.
const buf4 = Buffer.from([1, 2, 3]);

//console.log( buf4 );
// -> <Buffer 01 02 03>


// ASCII バイトを含んだバッファを作成する
//Creates a Buffer containing ASCII bytes [0x74, 0x65, 0x73, 0x74].
const buf5 = Buffer.from('test');

//console.log( buf5 );
// -> <Buffer 74 65 73 74>

// UTF-8形式のバッファを作成するb
// Creates a Buffer containing UTF-8 bytes [0x74, 0xc3, 0xa9, 0x73, 0x74].
const buf6 = Buffer.from('tést','utf8');

// console.log( buf6 );
// -> <Buffer 74 c3 a9 73 74>


