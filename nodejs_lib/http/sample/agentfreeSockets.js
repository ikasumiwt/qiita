// 以下の検証用コード
// keepSocketAlive(socket), reuseSocket(socket, req)
// NODE_DEBUG=http node reuseSocket.js

const http = require('http')

// agent作成
const agent = http.Agent({
  keepAlive: true,
  maxSockets: 5,
  maxFreeSockets: 2
})

// server側のコード
const server = http.createServer((req, res) => {
  // console.log('ok')

  setTimeout(() => {
    res.end('ok')
  }, 100)
})

// 検証用に短めに
server.keepAliveTimeout = 1000

server.listen('18888', () => {

  // request
  function req(callback) {
    http.request({
      method: 'GET',
      path: '/',
      // host: 'localhost',
      agent, // 独自Agent追加
      port: 18888
    }, (res) => {
      res.resume()
      res.once('end', () => {
        // setImmediateしないとreuseされない
        console.log(agent.freeSockets)
        setImmediate(callback)
      })
    }).end()
  }

  // destroy
  req(() => {
    // keep
    req(() => {
      // reuse
      req(() => {
        server.close()
      })
    })
  })

})
