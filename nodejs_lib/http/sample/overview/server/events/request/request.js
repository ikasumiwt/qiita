'use strict'
const http = require('http')
const net = require('net')


const opt = {
  host: 'localhost',
  port: 3000,
  method: 'GET'
}

let count = 0
const onResponse = (res) => {
    res.on('data', (chunk) => {
      console.log('[client] data event')
    })
    res.on('end', () => {
      console.log('[client] end event')

      count++
      if(count < 2) {
        console.log(`request count: ${count}`)
        http.request(opt, onResponse).end()
      } else {
        console.log('request end')
      }
    })
}

const req = http.request(opt, onResponse)

req.end()
