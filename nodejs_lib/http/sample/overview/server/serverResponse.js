'use strict'
const http = require('http')

// req: in
const server = http.createServer((req, res) => {

  /*
   * http.ServerResponse property 
   */
  console.log('---- serverresponse property ----')
  console.log(`sendDate ... ${res.sendDate}`)
  console.log(`shouldKeepAlive ... ${res.shouldKeepAlive}`)
  console.log(`statusCode ... ${res.statusCode}`)
  console.log(`statusMessage ... ${res.statusMessage}`)

  /*
   * outgoingmessage property 
   */
  console.log('---- outgoingmessage property ----')
  console.log(`connection ... ${res.connection}`)
  console.log(`finished ... ${res.finished}`)
  console.log(`headersSent ... ${res.headersSent}`)
  console.log(`socket ... ${res.socket}`)
  
  /*
   * events
   */

  //  serverresponse and outgoingmessage
  res.on('finish', () => {
    console.log('finish event is fired')
  
  })
  // serverresponse only
  res.on('close', () => {
    console.log('close event is fired')
  })

  /*
   * methods
   */
  console.log('---- ServerResponse Methods ----')

  // chunked encodingのときのみ
  // res.addTrailers({ 'x-hoge': 'fuga' })
  res.setHeader('X-TEST', 'test');
  res.setHeader('X-REMOVE', 'REMOVE');
  console.log(res.getHeaders())
  console.log(res.getHeaderNames())
  console.log(`res.getHeader('x-test') ... ${res.getHeader('x-test')}`)
  console.log(`res.hasHeader('x-remove') ... ${res.hasHeader('X-REMOVE')}`)
  res.removeHeader('X-REMOVE')
  console.log(`res.hasHeader('x-remove') ... ${res.hasHeader('X-REMOVE')}`)

  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.write('writing')

  // checkContinueイベントのところに追加
  // writeContinue, setTimeout

  // 普段使わないので省略
  // assignSocket(), detachSocket()

  

  // end() is OutgoingMessage method
  res.end('hello')
})

/* 
 * http.Server events
 * req: IncomingMessage
 * res: ServerResponse
 */
server.on('close', () => {
  console.log('close event')
})

server.on('checkContinue', (req, res) => {
  console.log('checkContinue')

  res.writeContinue()

  setTimeout(() => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('continue end')
  }, 2000)
})
server.on('request', (req, res) => {
  console.log('request')
})


/*
 * http.Server methods
 */

// listen
server.listen(3000)

