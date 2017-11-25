'use strict'

const http = require('http')

// client sample
const options = {
  host: 'www.yahoo.co.jp',
}

const req = http.get(options)
req.end();
req.once('response', (res) => {
/*
  const ip = req.socket.localAddress
  const port = req.socket.localPort
  console.log(`Your IP address is ${ip} and your source port is ${port}.`);
  */
  // consume response object
  console.log(res)
})
