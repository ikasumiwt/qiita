'use strict';

var intArr = [
                0x00,
                0xff,
                0xffff,
                ];
var buf = Buffer.allocUnsafe(4);;

buf.writeUInt32BE(0x0011aaff, 0);

console.log(buf);


//2byte以上を書き込もうとするとエラー
//buf.writeUInt8(0xffff, 2);

buf.writeUInt32LE(0x0011aaff, 0);

console.log(buf);





