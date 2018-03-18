'use strict'
const http = require('http')
const opt = {
  host: 'node-websocket-test.appspot.com',
  port: '80',
  path: '/'
}

const req = http.request(opt, (req) => {
  console.log(req)
})



req.end()
