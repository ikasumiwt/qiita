'use strict'

const http = require('http')

const server = http.createServer()

const port = 1337;

// クライアントからのリクエストボディのデータをレスポンスとして返す

server.on('request', (req, res) => {
  var data = '';

  req.on('data', (chunk) => {
    data += chunk
  })

  req.on('end', () => {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('Body Echo' + data + '\n') // HTTPの生データの出力
  })
})

server.on('connection', (socket) => {

  console.log('=== Raw Socket Data Start ===')

  socket.on('data', (chunk) => {
    console.log(chunk.toString())
  })

  socket.on('end', () => {
    console.log('=== Raw Socket Data End ===')
  })
})

server.on('clientError', (e) => {
  console.log('Client Error:' + e.message)
})

server.on('serverError', (e) => {
  console.log('Server Error:' + e.message)
})

server.listen(port, () => {
  console.log('Server lintening: ' + port)
})


// エコーサーバ起動
// $ node http_server_echo.js
// Server lintening: 1337
// === Raw Socket Data Start ===
// POST / HTTP/1.1
// Host: localhost:1337
// User-Agent: curl/7.54.0
// Accept: */*
// Content-Length: 11
// Content-Type: application/x-www-form-urlencoded
//
// a=1&b=2&c=3
// === Raw Socket Data End ===


// ----------------------------------------------
// リクエスト側

// $ curl -X POST -D - -d'a=1&b=2&c=3' http://localhost:1337
// HTTP/1.1 200 OK
// Content-Type: text/plain
// Date: Sun, 03 Dec 2017 20:11:21 GMT
// Connection: keep-alive
// Transfer-Encoding: chunked
//
// Body Echoa=1&b=2&c=3
