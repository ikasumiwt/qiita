'use strict'
const http = require('http')

// req: in
const server = http.createServer((req, res) => {

  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('hello')
})

/* 
 * http.Server events
 * req: IncomingMessage
 * res: ServerResponse
 */
server.on('checkContinue', (req, res) => {
  console.log('checkContinue')
})
/*
server.on('checkExpectation', (req, res) => {
  console.log('checkExpectation')
})

server.on('clientError', (err, socket) => {
  console.log('client error')
  console.log(err)
})
*/

server.on('close', () => {
  console.log('close event')
})

/*
server.on('connect', (req, socket, head) => {
  console.log('connect event')
})

server.on('connection', (socket) => {
  console.log('connection')
})

server.on('request', (req, res) => {
  console.log('request')
})

server.on('upgrade', (req, socket, head) => {
  console.log('upgrade')
})
*/

/*
 * http.Server methods
 */

// listen
server.listen(3000)

// close
// server.close()


/*
 * http.Server property
 */

console.log(`------------property-------------`)
console.log(`listening ... ${server.listening}`)
console.log(`maxHeadersCount ... ${server.maxHeadersCount}`)
console.log(`keepAliveTimeout ... ${server.keepAliveTimeout}`)
console.log(`--------------------------------`)
