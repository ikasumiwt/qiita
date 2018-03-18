'use strict'
const net = require('net')

const opt = {}

// net serverでconnectionイベントを待ち受ける

const server = net.createServer()

server.listen(8888, (req) => {
  console.log('listened')
})

server.on('connection', (socket) => {
  socket.on('data', (chunk) => {

    console.log(chunk.toString())
  })
})



