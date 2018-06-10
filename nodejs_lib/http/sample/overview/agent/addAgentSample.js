
const http = require('http')

// agent作成
const agent = new http.Agent({
  keepAlive: true
})

const option = {
  host: 'localhost',
  port: 3000,
  method: 'GET'
}

option.headers = {'X-MESSAGE': 'use globalAgent'}
const req = http.request(option, (res) => {
  res.resume()

  res.on('data', (res) => {
    console.log('[cli] data event')
  })
  res.once('end', () => {
    console.log('end event')
  })
})

console.log('---** use global agent **---')
req.end()


option.headers = {'X-MESSAGE': 'use Agent'}
option.agent = agent // 独自Agent追加
const req2 = http.request(option, (res) => {
  res.resume()

  res.on('data', (res) => {
    console.log('[cli] data event')
  })
  res.once('end', () => {
    console.log('end event')
    console.log(req2.socket.destroyed)
    agent.destroy()
    console.log(req2.socket.destroyed)
  })
})

console.log('---** use agent **---')
req2.end()
