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

