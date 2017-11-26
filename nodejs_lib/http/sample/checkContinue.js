const http = require('http');

let outstanding_reqs = 0;
const test_req_body = 'some stuff...\n';
const test_res_body = 'other stuff!\n';
let sent_continue = false;
let got_continue = false;


const server = http.createServer((req, res) => {
  // assert.strictEqual(sent_continue, true, 'Full response sent before 100 Continue');
  console.error('Server sending full response...');
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'ABCD': '1'
  });
  res.end(test_res_body);
});

server.on('clientError', (err, socket) => {
  console.log('[server] emitted clientError events')
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');

  // 自前でクローズ
  server.close();
});

server.listen(8000);

server.on('listening', function() {
  const req = http.request({
    port: this.address().port,
    method: 'POST',
    path: '/world',
    headers: { 'Expect': '100-continue' }
  });
  console.error('Client sending request...');
  outstanding_reqs++;
  let body = '';
  req.on('continue', function() {
    console.error('Client got 100 Continue...');
    got_continue = true;
    req.end(test_req_body);
  });
  req.on('response', function(res) {
    // assert.strictEqual(got_continue, true, 'Full response received before 100 Continue');
    // assert.strictEqual(200, res.statusCode, `Final status code was ${res.statusCode}, not 200.`);
    res.setEncoding('utf8');
    res.on('data', function(chunk) { body += chunk; });
    res.on('end', function() {
      console.error('Got full response.');
      // assert.strictEqual(body, test_res_body, 'Response body doesn\'t match.');
      // assert.ok('abcd' in res.headers, 'Response headers missing.');
      outstanding_reqs--;
      if (outstanding_reqs === 0) {
        server.close();
        process.exit();
      }
    });
  });
});
