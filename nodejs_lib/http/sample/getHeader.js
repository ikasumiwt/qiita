const http = require('http')

const server = http.createServer((req, res) => {

  res.setHeader('Foo', 'bar');
  res.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);
  const headerNames = res.getHeaderNames();
  console.log(headerNames)
  console.log("--------")
  console.log(res.getHeaders())
  // headerNames === ['foo', 'set-cookie']
  res.end()
})

server.listen(18888)

// request curl: curl localhost:8080


