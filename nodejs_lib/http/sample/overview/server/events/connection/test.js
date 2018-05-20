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

req.end('first')
