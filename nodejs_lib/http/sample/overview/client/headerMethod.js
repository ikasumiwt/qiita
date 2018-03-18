'use strict'
const http = require('http')

const server = http.createServer()

server.on('request', (req, res) => {
  // flushされることにより発火
  console.log('server request event was fired')
  console.log(req.headers)
  res.end('ok')
  server.close()
})

server.listen(8888, '127.0.0.1', () => {
  
  // server.listen後にリクエストを行う
  const req = http.request({
    method: 'POST',
    host: 'localhost',
    port: '8888',
  })

  // 1. setHederの動作
  // -> https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_request_setheader_name_value
  req.setHeader('hoge', 'hoge-hoge')
  req.setHeader('rm', 'remove-header')
  // 1.1 セットしたヘッダを確認
  console.log('[check] hoge Header : ' + req.getHeader('hoge'))
  console.log('[check] rm Header: ' + req.getHeader('rm'))
  
  console.log('----------')
  // 2 removeHeaderの動作
  // -> https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_request_removeheader_name
  req.removeHeader('rm')
  // 2.2 removeHeaderされてrm headerがなくなっていることを確認
  console.log('[check] rm Header : ' + req.getHeader('rm'))
  console.log('----------')

  // 3 flushHeadersの動作 ( server側に渡される
  // req.flushHeaders()

  req.end('not flushHeader')
})

