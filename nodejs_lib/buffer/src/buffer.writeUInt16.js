'use strict';

var intArr = [
                0x00,
                0xff,
                0xffff,
                ];
var buf = Buffer.allocUnsafe(4);;

buf.writeUInt8(0x00, 0);
buf.writeUInt8(0xff, 1);
buf.writeUInt8(0xff, 2);
buf.writeUInt8(0x1a, 3);

//2byte以上を書き込もうとするとエラー
//buf.writeUInt8(0xffff, 2);

/*
  0,255,255
*/
console.log(buf);





