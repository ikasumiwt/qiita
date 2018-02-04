'use strict'
const http = require('http')

const server = http.createServer()
server.on('request', (req, res) => {
  // flushされることにより発火
  console.log(req.headers['hoge'])
  res.end('ok')
  server.close()
})

server.listen(8888, '127.0.0.1', () => {
  const req = http.request({
    method: 'GET',
    host: '127.0.0.1',
    port: '8888',
  }); 
  req.setHeader('hoge', 'hoge-hoge')
  req.setHeader('rm', 'remove-header')
  console.log('getHeader: ' + req.getHeader('hoge'))
  console.log('getHeader: ' + req.getHeader('rm'))
  req.removeHeader('rm')
  console.log('getHeader: ' + req.getHeader('rm'))

  req.flushHeaders()
});
