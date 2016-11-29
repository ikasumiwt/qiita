'use strict';

var intArr = [
                0x00,
                0xff,
                0xffff,
                ];
var buf = Buffer.from(intArr);

/*
  0,255,255
*/
console.log(buf.readUInt8(0));
console.log(buf.readUInt8(1));
console.log(buf.readUInt8(2));



