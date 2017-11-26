const http = require('http');

// simple_server.jsに対してリクエストする
const options = {
  port: 8888,
  hostname: '127.0.0.1',
  method: 'GET',
  path: '/'
};

const req = http.request(options);
req.end();

req.on('connect', (res, socket, head) => {
  console.log('[client] got connected!');
/*
  // make a request over an HTTP tunnel
  socket.write('GET / HTTP/1.1\r\n' +
  'Host: www.google.com:80\r\n' +
  'Connection: close\r\n' +
  '\r\n');
  socket.on('data', (chunk) => {
    console.log(chunk.toString());
  });
  socket.on('end', () => {
    proxy.close();
  });
*/
});

req.on('abort', (res, socket, head) => {
  console.log('[client] abort');
});


req.on('continue', () => {
  console.log('[client] continue');
});

req.on('response', (res) => {
  console.log('[client] response');
});

req.on('socket', (socket) => {
  console.log('[client] socket');
});

req.on('timeout', () => {
  console.log('[client] timeout');
});

req.on('upgrade', (res, socket, head) => {
  console.log('[client] upgraded');
});
