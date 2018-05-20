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
 * err: error object
 * socket: socket
 */
server.on('connect', (req, socket, head) => {
  console.log('[server] ** connect ** event')
  console.log(req.headers)
  // console.log(req)
  socket.write('HTTP/1.1 200 Connection Established\r\n'
    + 'Connection: close\r\n'
    + 'Content-type: text/plain\r\n'
    + 'Content-Length: 5\r\n'
    + '\r\n'
  )
  // socket.write('HTTP/1.1 200 Connection Established\r\n')
  socket.end('hello')
  server.close()
})

// listen
server.listen(3000)

server.on('close', () => {
  console.log('[server] close event')
})

console.log(`listening on 3000`)
