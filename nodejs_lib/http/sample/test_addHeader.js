'use strict'

/*
test/parallelは https://github.com/nodejs/node/blob/master/test/parallel/test-http-incoming-matchKnownFields.js

以下のコードに対するテスト
function _addHeaderLine(field, value, dest) {
  field = matchKnownFields(field);
  var flag = field.charCodeAt(0);
  if (flag === 0 || flag === 2) {
    field = field.slice(1);
    // Make a delimited list
    if (typeof dest[field] === 'string') {
      dest[field] += (flag === 0 ? ', ' : '; ') + value;
    } else {
      dest[field] = value;
    }
  } else if (flag === 1) {
    // Array header -- only Set-Cookie at the moment
    if (dest['set-cookie'] !== undefined) {
      dest['set-cookie'].push(value);
    } else {
      dest['set-cookie'] = [value];
    }
  } else if (dest[field] === undefined) {
    // Drop duplicates
    dest[field] = value;
  }
}

*/
const http = require('http')
const IncomingMessage = http.IncomingMessage;


// flag = 0の場合 : transfer-encodingの場合
// 正: カンマ区切りで追加される
let field = 'Transfer-Encoding'
let dest = {}
// incoming messageに特定の値で宣言
let incomingMessage = new IncomingMessage('transfer-encoding test');


incomingMessage._addHeaderLine(field, 'first', dest);
console.log(dest)
incomingMessage._addHeaderLine(field, 'second', dest);
console.log(dest)

// flag = 2の場合 : cookieの場合
// 正: カンマ区切りで追加される
field = 'cookie'
dest = {}
// incoming messageに特定の値で宣言
incomingMessage = new IncomingMessage('cookie test');
incomingMessage._addHeaderLine(field, 'first', dest);
console.log(dest)
incomingMessage._addHeaderLine(field, 'second', dest);
console.log(dest)


// flag = 1の場合 : set-cookieの場合
// 正: 配列になってで追加される
field = 'set-cookie'
dest = {}
// incoming messageに特定の値で宣言
incomingMessage = new IncomingMessage('set-cookie test');
incomingMessage._addHeaderLine(field, 'first', dest);
console.log(dest)
incomingMessage._addHeaderLine(field, 'second', dest);
console.log(dest)


// flagには関係ないもの : たとえばuser-agent
// 正: 1つめ優先で2つめ以降はdrop
field = 'user-agent'
dest = {}
// incoming messageに特定の値で宣言
incomingMessage = new IncomingMessage('user-agent test');
incomingMessage._addHeaderLine(field, 'first', dest);
console.log(dest)
incomingMessage._addHeaderLine(field, 'second', dest);
console.log(dest)
