'use strict';
const assert = require('assert');

const http = require('http');

const server = http.createServer((req, res) => {
  res.end('ok');
}).listen(0, () => {
  const agent = http.Agent({
    keepAlive: true,
    maxSockets: 5,
    maxFreeSockets: 2
  });

  const keepSocketAlive = agent.keepSocketAlive;
  const reuseSocket = agent.reuseSocket;

  let called = 0;
  let expectedSocket;
  agent.keepSocketAlive = (socket) => {
    assert(socket);

    console.log('keepSocketAlive')
    called++;
    if (called === 1) {
      return false;
    } else if (called === 2) {
      expectedSocket = socket;
      return keepSocketAlive.call(agent, socket);
    }

    // assert.strictEqual(socket, expectedSocket);
    return false;
  };

  agent.reuseSocket = (socket, req) => {
    assert.strictEqual(socket, expectedSocket);
    assert(req);
    console.log('reuse socket')
    return reuseSocket.call(agent, socket, req);
  }

  function req(callback) {
    http.request({
      method: 'GET',
      path: '/',
      agent,
      port: server.address().port
    }, (res) => {
      res.resume();
      res.once('end', () => {
        setImmediate(callback);
      });
    }).end();
  }

  // Should destroy socket instead of keeping it alive
  req(() => {
    // Should keep socket alive
    req(() => {
      // Should reuse the socket
      req(() => {
        server.close();
      });
    });
  });
});
