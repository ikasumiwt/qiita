const crypto = require('crypto')
const text = 'plane text'
const pass = 'abcde'

console.log(crypto.getHashes())

 let cipher = crypto.createCipher('aes-256-cbc', pass)
console.log('cipher---')
console.log(cipher)
/*

cipher.update(text, 'utf8', 'hex');
console.log('cipher---')
console.log(cipher)

let ciphered = cipher.final('hex')
console.log('---cipherd')
console.log(cipherd)
*/




