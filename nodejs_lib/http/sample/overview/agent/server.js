'use strict'
const http = require('http')

// req: incoming
// res: serverresponse
const server = http.createServer((req, res) => {

  console.log('[server] response event')
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    // 'Content-Length': 5,
    'Trailer': 'Expires'
  })
  res.end('hello')
})

/*
 * http.Server events
 * req: IncomingMessage
 * res: ServerResponse
 */
server.on('request', (req, res) => {
  console.log('[server] ** request ** event')
  console.log(req.headers)
  // console.log(socket)
})
// listen
server.listen(3000)

server.on('close', () => {
  console.log('[server] close event')
})

console.log(`listening on 3000`)
