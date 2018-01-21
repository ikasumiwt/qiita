const http = require('http')

// headers <Object> An object containing request headers.
// NowBrowsing: error http request at headers is array · Issue #8235 · nodejs/node: https://github.com/nodejs/node/issues/8235

// set header array ver
// このパターンだとexみたいにOutHeadersKeyにはいらない
let opt = { 'host': 'www.yahoo.co.jp', 'headers': [ ['Cookie', 'hogehoge'], ['Host', 'www.yahoo.co.jp'] ]}

// ちなみにnodeをビルドして　https://github.com/nodejs/node/blob/master/lib/_http_outgoing.js#L328　に仕込んだところ普通に値は入っていそう
/*
$ ./node-build  http/sample/setHeader.js 
-- header arrayCookie:hogehoge
-- header arrayHost:www.yahoo.co.jp
*/

// なので、_headerには以下みたいに入る
// _header: 'GET / HTTP/1.1\r\nCookie: hogehoge\r\nHost: www.yahoo.co.jp\r\nConnection: keep-alive\r\n\r\n',

// TODO: 謎

// set header non-array ver
// opt = {'headers': {'Cookie': 'hogehoge'}}
/* ex)
  [Symbol(outHeadersKey)]: 
    { cookie: [ 'Cookie', 'hogehoge' ],
     host: [ 'Host', 'localhost' ] } }
*/

const req = http.request(opt)


req.end()

console.log(req)

