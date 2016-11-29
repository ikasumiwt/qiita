'use strict';

var intArr = [
                0xff,
                0xff,
                0xfe,
                0xff,

                ];
var buf = Buffer.from(intArr);


/*
  65535 65279
*/
console.log(buf.readUInt16LE(0));
console.log(buf.readUInt16LE(1));

/*
  65535 65534
*/
console.log(buf.readUInt16BE(0));
console.log(buf.readUInt16BE(1));




