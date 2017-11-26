const http = require('http');


const server = http.createServer((req, res) => {
  // assert.strictEqual(sent_continue, true, 'Full response sent before 100 Continue');
  console.error('created');
  res.writeHead(200, {});
  res.end();
});

server.listen(8888, () => {

  const s = server.setTimeout(50, (socket) => {
      socket.destroy();
      server.close();
      // cb();
    });

    http.get({
      port: server.address().port
    }).on('error', () => {});
});
