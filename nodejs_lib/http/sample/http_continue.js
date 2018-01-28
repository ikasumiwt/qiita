const http = require('http')

// Server

// testサーバを作成する
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('ok')
})

// continueのとき用
server.on('checkContinue', (req, res) => {
  console.log('in checkContinue event')
  res.writeContinue()

  setTimeout(() => {
    // 100ms後にcontinueおわり
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'ABCD': '1'
    })
    res.end('continueeeeeeeeeee')
  }, 100)

})

server.listen(8888)

// client req
const option = {
  port: 8888,
  hostname: '127.0.0.1',
  method: 'POST',
  headers: { 'Expect': '100-continue' }
}

const req = http.request(option, (res) => {
  res.on('data', (chunk) => {
    console.log('data:' + chunk)
  })
  res.on('end', () => {

    server.close()
  })
})


req.on('continue', () => {
  console.log('continue event')
  req.end('continue...')
})

req.end()
