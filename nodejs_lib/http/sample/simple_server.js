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

// docにあるすべてのイベントを待ち受け
server.on('checkContinue', (req, res) => {})
server.on('checkExpectation', (req, res) => {})
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
})
server.on('close', (req, res) => {})
server.on('connect', (req, socket, head) => {})
server.on('connection', (socket) => {})
// server.on('request', (req, res) => {})
server.on('upgrade', (req, res) => {})


// listeningの値チェック
console.log('before listen()')
console.log(server.listening)

server.listen(8888)

console.log('after listen()')
console.log(server.listening)







