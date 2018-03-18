'use strict'
const http = require('http')

const server = http.createServer()

server.on('request', (req, res) => {
  res.end('ok')
  server.close()
})

server.listen(8888, '127.0.0.1', () => {
  
  // server.listen後にリクエストを行う
  const req = http.request({
    method: 'GET',
    host: 'localhost',
    port: '8888',
  })

  req.setHeader('content-type', 'text/plain')
  // getHeaderが大文字小文字を区別しないことを確認
  console.log('[check] content-type Header : ' + req.getHeader('content-type'))
  console.log('[check] Content-Type Header : ' + req.getHeader('Content-Type'))

  req.end('test')
})

