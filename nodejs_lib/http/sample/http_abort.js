const http = require('http')

const option = {
  'host': 'html5.ohtsu.org'
}

const req = http.request(option, (res) => {
  res.on('data', (chunk) => {
    console.log('data:' + chunk)
  })
  req.abort()
})

req.on('abort', () => {
  console.log('abort')
})

req.end()
