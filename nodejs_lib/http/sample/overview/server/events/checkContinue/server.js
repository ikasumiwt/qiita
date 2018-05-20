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
 * req: IncomingMessage
 * res: ServerResponse
 */
server.on('checkContinue', (req, res) => {
  console.log('[server] checkContinue events')
  console.log(req.headers)
  let data = ''
  req.on('data', (chunk) => {
    // res.setEncoding('utf8')
    console.log('server: data event: ' + chunk.toString())
    data += chunk
  })
  req.on('end', () => {
    console.log('[server] end')
    console.log(data)
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('finished')
    // req.destroy()
    server.close()
  })
  // client側が送信を続ける必要がある場合はwriteContinueを
  res.writeContinue()
})

// listen
server.listen(3000)

server.on('close', () => {
  console.log('[server] close event')
})

console.log(`listening on 3000`)
