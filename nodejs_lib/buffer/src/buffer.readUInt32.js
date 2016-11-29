'use strict';

var intArr = [
                0xff,
                0xff,
                0xff,
                0xff,
                0xfe,
                0xff,

                ];
var buf = Buffer.from(intArr);


/*
  4294967295 4278190079
*/
console.log(buf.readUInt32LE(0));
console.log(buf.readUInt32LE(1));

/*
  4294967295 4294967294
*/
console.log(buf.readUInt32BE(0));
console.log(buf.readUInt32BE(1));




