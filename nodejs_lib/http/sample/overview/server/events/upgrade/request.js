'use strict'
const http = require('http')
const net = require('net')


const opt = {
  host: 'localhost',
  port: 3000,
  headers: {
    'Connection': 'Upgrade',
    'Upgrade': 'websocket'
  }
}
const req = http.request(opt)

req.on('upgrade', (res, socket, head) => {
  console.log('[client] upgrade event')
  socket.end()
});

req.end()
