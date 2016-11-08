const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0 ; i < 26 ; i++) {
  // 97 is the decimal ASCII value for 'a'
  buf1[i] = i + 97;
 }

//prints: abcdefghijklmnopqrstuvwxy
console.log(buf1.toString('ascii', 0, 25));
buf1.copy(buf2, 8, 16, 20);
//qrstをbuf2のbuf2[8]~の箇所に コピー
// Prints: !!!!!!!!qrst!!!!!!!!!!!!!
console.log(buf2.toString('ascii', 0, 25));


