'use strict';

var intArr = [
                0x00,
                0xff,
                0xffff,
                ];
var buf = Buffer.allocUnsafe(4);;

buf.writeUInt16LE(0x11ff, 0);
buf.writeUInt16LE(0x00ff, 2);


console.log(buf);

//4byte以上を書き込もうとするとエラー
//buf.writeUInt16LE(0x00ff1133, 2);
//buf.writeUInt16BE(0xff1133, 2);

buf.writeUInt16BE(0x11ff, 0);
buf.writeUInt16BE(0x00ff, 2);

console.log(buf);





