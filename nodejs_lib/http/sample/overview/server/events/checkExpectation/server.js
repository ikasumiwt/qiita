'use strict'
const http = require('http')

// req: in
const server = http.createServer((req, res) => {

})

/* 
 * http.Server events
 * req: IncomingMessage
 * res: ServerResponse
 */
server.on('checkExpectation', (req, res) => {
  console.log('[server] checkExpectation')
  console.log(req.headers)
  res.writeHead(400)
  res.end()
  server.close()
})

server.on('close', () => {
  console.log('[server] close event')
})

// listen
server.listen(3000)

console.log(`listening on 3000`)
