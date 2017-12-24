const http = require('http');
const globalAgent = http.globalAgent
// const agent = new http.Agent({})

const options = {
  host: 'localhost',
  port: 18888,
  hostname: 'localhost',
  method: 'GET',
  path: '/',
  family: 4,
  localAddress: '192.168.3.22'// '172.16.122.132'
  // agent: agent,
};

const name = globalAgent.getName(options)

// default=infinite なので1つにしぼり検証
globalAgent.maxSockets = 1


for(let i=0; i < 10; i++){
  const req = http.request(options)

  // onendのタイムアウト?
  req.on('response', (res) => {
    // console.log(agent.requests)
    // res.resume()
    //console.log(res)
  })

  req.on('socket', (socket) => {
    socket.setTimeout(100, () => {
      console.log('timeout')
      // req.socket.end()
    })

    if(globalAgent.requests[name]) {
      console.log(name, globalAgent.requests[name].length)
    }
  })

  req.end()
}
