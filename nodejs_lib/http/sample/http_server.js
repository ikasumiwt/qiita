'use strict'

const http = require('http')

// serverサンプル
let server = http.createServer()

server.on('request', (req, res) => {
  res.writeHead(200, {'Cintent-Type': 'text/plain'})
  res.write('hello world!')
  res.end()
})


// default 5000msなので検証用に書き換え
server.keepAliveTimeout = 500

server.on('listening', () => {
  console.log('server listening',  server.address())
})


server.on('connection', () => {
  console.log('server is connection')
})


server.listen(18888)


