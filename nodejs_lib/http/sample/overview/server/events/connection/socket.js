'use strict'
const http = require('http')
const net = require('net')

const dummy = 'GET / HTTP/1.1\r\n' +
            'Connection: close\r\n' +
            '\r\n';

const con = net.connect({port: 3000, host: 'localhost'})

con.on('connect', () => {
  let data = ''
  con.on('data', (chunk) => {
    console.log('[socket]: data')
    data += chunk
  })

  con.on('end', () => {
    console.log(data.toString())
    console.log('[socket]: end')
  })
  console.log('[client] write function ')
  con.write(dummy)
})

