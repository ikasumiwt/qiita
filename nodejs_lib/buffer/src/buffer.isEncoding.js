let isEncoding = Buffer.isEncoding('utf8');

console.log(isEncoding);
// -> true
isEncoding = Buffer.isEncoding('hogehoge');
console.log(isEncoding);
// -> false

