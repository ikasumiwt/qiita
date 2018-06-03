'use strict'
const http = require('http')
const net = require('net')


const opt = {
  host: 'localhost',
  port: 3000,
  method: 'GET'
}

const onResponse = (res) => {
  console.log('[client] onresponse event')
  console.log(res.headers)
  res.on('data', (chunk) => {
    console.log('[client] data event')
  })
  res.on('end', () => {
    console.log('[client] end event')
    console.log(res.rawTrailers)
  })
}

const req = http.request(opt, onResponse)

req.end()
