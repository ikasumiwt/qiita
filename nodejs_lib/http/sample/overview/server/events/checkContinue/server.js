'use strict'
const http = require('http')
const maxContentSize = 3500

const isPostMethod = (req) => {
  return req.method === 'post'
}

const getPostData = (req, res) => {
  let data = ''
  req.on('data', (chunk) => {
    // res.setEncoding('utf8')
    console.log('server: data event: ' + chunk.toString())
    data += chunk
  })
  req.on('end', () => {
    console.log('[server] end')
    console.log(data)
    res.writeHead(200, 'OK', { 'Content-Type': 'text/plain' })
    res.end('finished\n')
  })
}

// req: incoming
// res: serverresponse
const checkContentLength = (req) => {
  // reqest headerのcontent-lengthによってレスポンスを変える
  const length = parseInt(req.headers['content-length'])

  console.log(`length: ${length}`)

  // lengthがmaxContentSize以内だった場合以外はエラー
  if(!length) {
    return false
  } else if (length <= maxContentSize) {
    return true
  } else {
    return false
  }

}

const server = http.createServer((req, res) => {

  if(!isPostMethod(req)) {
    res.writeHead(400, 'bad request')
  }

  let isContinue = checkContentLength(req)
  if (isContinue) {
    getPostData(req, res)
  } else {
    res.writeHead(400, 'bad request')
  }

  console.log('[server] response event')
})

/*
 * http.Server events
 * req: IncomingMessage
 * res: ServerResponse
 */
server.on('checkContinue', (req, res) => {

  if(!isPostMethod(req)) {
    res.writeHead(400, 'bad request')
  }

  let isContinue = checkContentLength(req)
  console.log(isContinue)
  console.log("------------------")
  if (isContinue) {
    res.writeContinue()
    getPostData(req, res)
  } else {
    res.writeHead(400, 'bad request')
  }
  console.log('[server] checkContinue events')
})

// listen
server.listen(3000)

server.on('close', () => {
  console.log('[server] close event')
})

console.log(`listening on 3000`)
