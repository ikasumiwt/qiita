'use strict'
const http = require('http')
const net = require('net')


const opt = {
  host: 'localhost',
  port: 3000,
  method: 'CONNECT'
}

const req = http.request(opt)

req.on('connect', (res, socket, head) => {
  console.log('[client] connect event')
  console.log(res.headers)
  let data = ''
  socket.on('data', (chunk)=> {
    console.log('[client] data event')
    data += chunk
  })

  socket.on('end', ()=> {
    console.log('[client] end event')
    console.log(data)
  })

})

req.end()
