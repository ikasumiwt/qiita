const buf = Buffer.allocUnsafe(5);

console.log(buf);
//prints: ex <Buffer 50 86 03 03 01> etc.
buf.fill(0);
//prints: 
//<Buffer 00 00 00 00 00>
console.log(buf);

