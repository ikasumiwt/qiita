const http = require('http');

/*
// doc sample code 
const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
*/

const net = require('net');

const server = http.createServer((req, res) => {
  res.end();
});

server.on('clientError', (err, socket) => {
  console.log('[server] emitted clientError events')
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');

  // 自前でクローズ
  server.close();
});


server.listen(8000, function() {
  function next() {
    const client = net.connect(server.address().port);
    client.end('Oopsie-doopsie\r\n');

    let chunks = '';
    client.on('data', function(chunk) {
      chunks += chunk;
    });
    client.once('end', function() {
      console.log('end chunks')
      console.log(chunks)
    });
  }

  // Normal request
  http.get({ port: this.address().port, path: '/' }, function(res) {
    res.resume();
    res.once('end', next);
  });

});



