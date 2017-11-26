'use strict'

const http = require('http')

// シンプルにとあるPortで受け付けるサーバを立てる
let server = http.createServer()

server.on('request', (req, res) => {
  console.log('requested')

  res.writeHead(200, {'Cintent-Type': 'text/plain'})
  res.write('hello world!')
  res.end()
})

server.on('listen', (req, res) => {
  console.log('on listen')
})

// docにあるすべてのイベントを待ち受ける
server.on('checkContinue', (req, res) => {

 console.error('Server got Expect: 100-continue...');
 res.writeContinue();
 sent_continue = true;
 setTimeout(function() {
   handler(req, res);
 }, 100);
})
server.on('checkExpectation', (req, res) => {

})

server.on('clientError', (err, socket) => {
  console.log('[server] emitted clientError events')
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  // 自前でクローズ
  server.close();
});

server.on('close', (req, res) => {
  console.log('on close')
})
server.on('connect', (req, socket, head) => {
  console.log('on connect')

})
server.on('connection', (socket) => {
  console.log('on connection')

})
server.on('upgrade', (req, res) => {
  console.log('on upgrade')

})


// listeningの値チェック
console.log('before listen()')
console.log(server.listening)

// 8888で待受
server.listen(8888)

console.log('after listen()')
console.log(server.listening)

// デフォルトはnull
console.log('maxHeaders:' + server.maxHeadersCount)
// デフォルトは5000 msec
console.log('keepAliveTimeout:' + server.keepAliveTimeout)
