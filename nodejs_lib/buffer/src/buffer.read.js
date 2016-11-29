'use strict';

//var buf = Buffer.from([32767,-33333]);
var intArr = [
                32767,
                32768,
                2147483647,
                2147483648,
                9223372036854775807,
                9223372036854775808
                ];
var buf = Buffer.from(intArr);

console.log(intArr.join(','));
console.log(buf);


console.log('buf:' +  buf.length);

//UInt8
console.log('readUInt8');
console.log(buf.readUInt8(0));
console.log(buf.readUInt8(1));
console.log(buf.readUInt8(2));
console.log(buf.readUInt8(3));
console.log(buf.readUInt8(4));
console.log(buf.readUInt8(5));

//UInt16LE
console.log('readUInt16LE');
console.log(buf.readUInt16LE(0));
console.log(buf.readUInt16LE(1));
console.log(buf.readUInt16LE(2));
console.log(buf.readUInt16LE(3));
console.log(buf.readUInt16LE(4));
//console.log(buf.readUInt16LE(5));

//UInt16BE
console.log('readUInt16BE');
console.log(buf.readUInt16BE()));
console.log(buf.readUInt16BE(0)));
console.log(buf.readUInt16BE(1));
console.log(buf.readUInt16BE(2));
console.log(buf.readUInt16BE(3));
console.log(buf.readUInt16BE(4));
//console.log(buf.readUInt16BE(5));

//UInt32LE
console.log('readUInt32LE');
//console.log(buf.readUInt32LE(5));


//UInt32BE
console.log('readUInt32BE');
//console.log(buf.readUInt32BE(5));




