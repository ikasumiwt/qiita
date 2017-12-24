// 以下の検証用コード
// keepSocketAlive(socket), reuseSocket(socket, req)
// NODE_DEBUG=http node reuseSocket.js

const http = require('http')

// agent作成
const agent = http.Agent({
  keepAlive: true,
  maxSockets: 2,
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

  const req1 = http.request({
      method: 'GET',
      path: '/',
      host: 'localhost',
      agent, // 独自Agent追加
      port: 18888
    }, (res) => {
      res.resume()
      res.once('end', () => {
        console.log('end event')
        // setImmediateしないとreuseされない
        
        console.log(req1.socket.destroyed)
        agent.destroy()
        // req1.socket.destroy()
        console.log(req1.socket.destroyed)
        //setImmediate(() => {})
        server.close()
      })
    })
    
    req1.end()

})
