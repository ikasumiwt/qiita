const http = require('http')

// Server

// testサーバを作成する
const server = http.createServer((req, res) => {
  // content-length分までendまつ
  res.writeHead(200, { 'Content-Length': '4' })
  res.write('...')

  server.once('timeout', () => {
    console.log('server timeout event')
    res.end('*')
  })
})

server.listen(8888)

// client req
const option = {
  port: 8888,
  hostname: '127.0.0.1',
  method: 'GET',
}

const req = http.request(option, (res) => {
  console.log('req---')
  req.setTimeout(50, () => {
    console.log('setTimeout method')
    server.emit('timeout')
  })
  res.on('data', (chunk) => {
    console.log('data:' + chunk)
  })
  res.on('end', () => {
    server.close()
  })
})

req.end()
