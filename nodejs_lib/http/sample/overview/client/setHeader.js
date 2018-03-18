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
  console.log('[check] content-type Header : ' + req.getHeader('content-type'))

  // setHeader
  req.setHeader('cookie', 'test1')
  console.log('[check] cookie Header : ' + req.getHeader('cookie'))
  // cookie自体には上書き
  req.setHeader('cookie', 'test2')
  console.log('[check] cookie Header : ' + req.getHeader('cookie'))
  // 複数指定したい場合は配列で渡す
  req.setHeader('cookie', ['arr1', 'arr2'])
  console.log('[check] cookie Header : ' + req.getHeader('cookie'))

  req.end('test')
})

