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

// keepSocketAliveのWrap
const keepSocketAlive = agent.keepSocketAlive
let count = 0
let expectedSocket

agent.keepSocketAlive = (socket) => {
  console.log('keepSocketAlive')

  count++
  if (count === 1) {
    console.log('socket is false')
    return false
  } else if (count === 2) {
    // trueの場合はsocketが同じものが使いまわされるはず
    console.log('socket is true')
    expectedSocket = socket
    return keepSocketAlive.call(agent, socket)
  }

  console.log('socket is false')
  console.log(expectedSocket)
  console.log(socket)
  // assert.strictEqual(socket, expectedSocket)
  return false
}

const reuseSocket = agent.reuseSocket
agent.reuseSocket = (socket, req) => {
  // reqの宛先によって出し分ける
/*
  socket.setTimeout(() => {
    socket.destory()
  }, 1000)
*/
  console.log('------reuseSocket')
  return reuseSocket.call(agent, socket, req)
}


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
        setImmediate(callback)
        //callback()
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
