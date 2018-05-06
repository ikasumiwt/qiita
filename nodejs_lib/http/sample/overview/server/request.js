'use strict'
const http = require('http')
const opt = {
  host: 'localhost',
  port: '3000',
  path: '/',
  method: 'POST'
}

const req = http.request(opt, (req) => {
  // console.log(req)
})

req.setHeader('X-YUSKATO', 'yuskato')

req.on('continue', () => {
  console.log('continue event')
  req.end('continue writing')
})

// checkContinue用
// req.setHeader('Expect', '100-continue')

req.end('first')
// req.write('first write')
