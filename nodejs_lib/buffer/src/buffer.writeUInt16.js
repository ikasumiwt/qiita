'use strict';

var intArr = [
                0x00,
                0xff,
                0xffff,
                ];
var buf = Buffer.allocUnsafe(4);;

buf.writeUInt16LE(0x00FF, 0);
buf.writeUInt16LE(0x00FF, 2);
console.log(buf);

//2byte以上を書き込もうとするとエラー
//buf.writeUInt8(0xffff, 2);

buf.writeUInt16BE(0x00FF, 0);
buf.writeUInt16BE(0x00FF, 2);
/*
  0,255,255
*/
console.log(buf);





