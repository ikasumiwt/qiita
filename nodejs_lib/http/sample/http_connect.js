const http = require('http');
const net = require('net');
const url = require('url');


// proxy用のサーバを作成する
const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});

// connectが来た場合はreq.urlに対してnet.connectでアクセスしにいく
proxy.on('connect', (req, cltSocket, head) => {
  // connect to an origin server
  const srvUrl = url.parse(`http://${req.url}`);
  console.log('2: request from client ... req.url::' + req.url)
  // net.connectによるTCP接続
  const srvSocket = net.connect(srvUrl.port, srvUrl.hostname, () => {
    console.log('3: net.connect to srvUrl')
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n')

    srvSocket.write(head)
    // serverとclientのsocketを相互にpipeする
    // srvSocketはcltSocketをpipeする
    // cltSocketはsrvSocketがconnectしてきた結果をsocket.on('data'で受け取る
    srvSocket.pipe(cltSocket)
    cltSocket.pipe(srvSocket)

  })

})

// proxyは
proxy.listen(8888, '127.0.0.1', () => {

  // make a request to a tunneling proxy
  // connectメソッドでアクセスする
  const options = {
    port: 8888,
    hostname: '127.0.0.1',
    method: 'CONNECT',
    // method: 'CONNECT',
    path: 'html5.ohtsu.org:80'
  }

  console.log('1:: http request')
  const req = http.request(options)
  req.end()

  req.on('socket', () => {

    console.log('-------------- socket --------------')
  })
  // リクエストがConnectだったときに発生
  req.on('connect', (res, socket, head) => {
    console.log('4:: established with connect method')
    // LL438のreq.emit(eventName, res, socket, bodyHead);で渡る
    // eventName(:CONNECT), socket(:this), bodyHead(:ret=parser.execute(d))
    // socketをいじってHTTP GETリクエストする
    console.log('5: client client socket write HTTP GET to Host')
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: html5.ohtsu.org:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n')

    let data = ''
    socket.on('data', (chunk) => {
      console.log('on data---')
      console.log(chunk.toString())
      data += chunk
    })

    // socketがendイベントになったときに自前でproxyサーバにcloseイベントをおくる必要がある
    socket.on('end', () => {
      console.log('6:  last: data is end and proxy.close()')
      proxy.close()
      console.log(data)
    })
  })
})
