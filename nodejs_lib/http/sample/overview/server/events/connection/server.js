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
server.on('connection', (socket) => {
  console.log('[server] ** connection ** event')
  server.close()
})
// listen
server.listen(3000)

server.on('close', () => {
  console.log('[server] close event')
})

console.log(`listening on 3000`)
