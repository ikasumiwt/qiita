'use strict'
const http = require('http')

// req: incoming
// res: serverresponse
const server = http.createServer((req, res) => {

  console.log('[server] response event')
  res.end('hello')
})

/*
 * http.Server events
 * req: IncomingMessage
 * socket: Socket
 * head: Buffer
 */
server.on('upgrade', (req, socket, head) => {
  console.log('[server] ** connect ** event')
  console.log(req.headers)
  // console.log(req)
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n')
  socket.pipe(socket) // echo back
  socket.on('end', () => {

    server.close()
  })
})

// listen
server.listen(3000)

server.on('close', () => {
  console.log('[server] close event')
})

console.log(`listening on 3000`)
