const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const buf3 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log( Buffer.compare( buf1,buf2 ));
// -> 1
console.log( Buffer.compare( buf2,buf3 ));
// -> 0
console.log( Buffer.compare( buf2,buf1 ));
// -> -1
