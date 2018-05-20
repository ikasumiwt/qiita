'use strict'
const http = require('http')
const opt = {
  host: 'localhost',
  port: '3000',
  path: '/',
  method: 'POST',
  headers: {
    'content-length': '5',
    'content-type': 'text/plain'
  }
}

const req = http.request(opt, (req) => {
  // console.log(req)
})

req.on('response', (res) => {
  console.log('[client] request response')
  console.log(res.headers)
  res.on('data', (chunk) => {
    console.log('[client] data event')
    console.log(chunk.toString())
  })
  res.on('end', () => {
    console.log('[client] end event')
  })
})

req.end('first')
