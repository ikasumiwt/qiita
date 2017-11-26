'use strict'

const http = require('http')

let options = {
  host: 'www.yahoo.co.jp'
}

http.get(options, (res) => {
  console.log('get')
  // Do stuff
}).on('socket', (socket) => {
  socket.emit('agentRemove');
});

