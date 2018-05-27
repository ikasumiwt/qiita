'use strict'
const http = require('http')

const data = 'aaa'
// checkContinue用にExpectを設定
const opt = {
  host: 'localhost',
  port: '3000',
  path: '/',
  method: 'POST',
  headers: {
    'Expect': '100-continue',
    'content-length': data.length,
    'content-type': 'text/plain'
  }
}


const req = http.request(opt)

req.on('continue', () => {
  console.log('[client] continue event and write data')
  req.end(data + '\n')
})

req.on('response', (res) => {
  console.log('[client] request response')

  console.log(res.httpVersion)
  console.log(res.statusCode)
  console.log(res.statusMessage)
  console.log(res.headers)
  res.on('data', (chunk) => {
    console.log('[client] data event')
    console.log(chunk.toString())
  })
  res.on('end', () => {
    console.log('[client] end event')
  })
})

console.log('[client] write function ')
req.write('')
