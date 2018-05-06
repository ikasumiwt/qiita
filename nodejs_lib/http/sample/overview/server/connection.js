'use strict'
const net = require('net')
const opt = {
  host: 'localhost',
  port: '3000'
}

const con = net.createConnection(opt, () => {
})
con.setEncoding('utf8')


con.on('connect', function() {
  con.write('GET / HTTP/1.1\r\nX-X: foo\r\n\r\n')
  con.end()
});


