'use strict';

var intArr = [
                0x00,
                0xff,
                0xffff,
                ];
var buf = Buffer.allocUnsafe(4);;

buf.writeUInt32BE(0x0011aaff, 0);
//4byte以上はエラー
//buf.writeUInt32BE(0x1122334455, 0);
//buf.writeUInt32LE(0x1122334455, 0);

console.log(buf);


buf.writeUInt32LE(0x0011aaff, 0);

console.log(buf);





