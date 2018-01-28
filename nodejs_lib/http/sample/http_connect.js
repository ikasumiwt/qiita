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
  console.log('req.url::::' + req.url)
  // net.connectによるTCP接続
  const srvSocket = net.connect(srvUrl.port, srvUrl.hostname, () => {

    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');

    srvSocket.write(head);
    // serverとclientのsocketを相互にpipeする
    // srvSocketはcltSocketをpipeする
    // cltSocketはsrvSocketがconnectシてきた結果をsocket.on('data'で受け取る
    srvSocket.pipe(cltSocket);
    cltSocket.pipe(srvSocket);

  });

});

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
  };

  const req = http.request(options);
  req.end();

  req.on('socket', () => {

    console.log('-------------- socket --------------')
  })
  // リクエストがConnectだったときに発生
  req.on('connect', (res, socket, head) => {
    console.log('request with connect method');
    // LL438のreq.emit(eventName, res, socket, bodyHead);で渡る
    // eventName(:CONNECT), socket(:this), bodyHead(:ret=parser.execute(d))
    // socketをいじってHTTP GETリクエストする
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: html5.ohtsu.org:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');

    socket.on('data', (chunk) => {
      console.log('on data---')
      console.log(chunk.toString());
    });

    // socketがendイベントになったときに自前でproxyサーバにcloseイベントをおくる必要がある
    socket.on('end', () => {
      proxy.close();
    });
  });
});
