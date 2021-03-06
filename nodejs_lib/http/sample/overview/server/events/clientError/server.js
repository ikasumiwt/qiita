'use strict'
const http = require('http')

// req: incoming
// res: serverresponse
const server = http.createServer((req, res) => {

  console.log('[server] response event')
  // res.end('hello')
})

/*
 * http.Server events
 * err: error object
 * socket: socket
 */
server.on('clientError', (err, socket) => {

  console.log('[server] clientError events')
  //console.log(err)
  // socketからendする
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');

  server.close()
})

server.on('close', () => {
  console.log('[server] close event')
})

// listen
server.listen(3000)
console.log(`listening on 3000`)
