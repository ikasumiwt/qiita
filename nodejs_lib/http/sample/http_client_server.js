'use strict'

const http = require('http')

// serverサンプル
let server = http.createServer()

server.on('request', (req, res) => {
  res.writeHead(200, {'Cintent-Type': 'text/plain'})
  res.write('hello world!')
  res.end()
})

server.listen(18888)


// client sample
const options = {
  host: 'www.yahoo.co.jp',
}

const req = http.get(options)
req.once('response', (res) => {
  const ip = req.socket.localAddress
  const port = req.socket.localPort
  console.log(`Your IP address is ${ip} and your source port is ${port}.`);
  // consume response object
})
req.end();
