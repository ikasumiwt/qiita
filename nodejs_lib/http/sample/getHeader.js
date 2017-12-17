const http = require('http')

const server = http.createServer((req, res) => {

  res.setHeader('Foo', 'bar');
  res.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);
  const headerNames = res.getHeaderNames();
  console.log("--------:getHeaderNames")
  console.log(headerNames) // headerNames === ['foo', 'set-cookie']
  console.log("--------:getHeaders")
  console.log(res.getHeaders())
  console.log("--------:hasHeader")
  console.log(res.hasHeader('Set-Cookie')) // true
  console.log(res.hasHeader('set-cookie')) // true

  res.end()
})

server.listen(18888)

// request curl: curl localhost:8080


