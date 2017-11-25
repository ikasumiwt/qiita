# notes
https://nodejs.org/api/crypto.html の読み物です。

## Node.js v8.9.1 Documentation

[docs](https://nodejs.org/dist/latest-v8.x/docs/api/http.html)

### HTTP
`Stability: 2 - Stable`

HTTPサーバとクライアントを使うためには、require('http')をする必要があります。

Node.jsのHTTPのインターフェースは、従来使うのが難しいとされてきた多くのプロトコルの機能をサポートするように設計されています。

特に、チャンクエンコードされた、大きなサイズのメッセージ等です。

このインターフェースは、リクエストやレスポンス全体をバッファリングしないように注意していて、ユーザーはストリームデータを扱うことが出来ます。

HTTPのヘッダーは以下のようなオブジェクトで表すことが出来ます。

```
{ 'content-length': '123',
  'content-type': 'text/plain',
  'connection': 'keep-alive',
  'host': 'mysite.com',
  'accept': '*/*' }
```

キーはlowercaseになります。値は変更されません。

Node.jsのHTTPのAPIは、HTTPアプリケーションの全部の範囲をサポートするために、非常に低レベルになっています。
ストリーム処理とメッセージの解析だけを扱います。
メッセージをヘッダーとボディーにパースしますが、実際のヘッダーやボディーについてはパースしません


重複したヘッダを扱う方法の詳細については、message.headersを参考にしてください。

受け取った生のヘッダーは、rawHeadersのプロパティーに保持されます。
これは[key, value, key2, value2, ...]の形式の配列で、
例えば↑のメッセージヘッダーのオブジェクトには以下のようなものがrawHeadersに入っています。

```
[ 'ConTent-Length', '123456',
  'content-LENGTH', '123',
  'content-type', 'text/plain',
  'CONNECTION', 'keep-alive',
  'Host', 'mysite.com',
  'accepT', '*/*' ]
```


### Class: http.Agent


An Agent is responsible for managing connection persistence and reuse for HTTP clients. It maintains a queue of pending requests for a given host and port, reusing a single socket connection for each until the queue is empty, at which time the socket is either destroyed or put into a pool where it is kept to be used again for requests to the same host and port. Whether it is destroyed or pooled depends on the keepAlive option.

Pooled connections have TCP Keep-Alive enabled for them, but servers may still close idle connections, in which case they will be removed from the pool and a new connection will be made when a new HTTP request is made for that host and port. Servers may also refuse to allow multiple requests over the same connection, in which case the connection will have to be remade for every request and cannot be pooled. The Agent will still make the requests to that server, but each one will occur over a new connection.

When a connection is closed by the client or the server, it is removed from the pool. Any unused sockets in the pool will be unrefed so as not to keep the Node.js process running when there are no outstanding requests. (see socket.unref()).

It is good practice, to destroy() an Agent instance when it is no longer in use, because unused sockets consume OS resources.

Sockets are removed from an agent when the socket emits either a 'close' event or an 'agentRemove' event. When intending to keep one HTTP request open for a long time without keeping it in the agent, something like the following may be done:


```
http.get(options, (res) => {
  // Do stuff
}).on('socket', (socket) => {
  socket.emit('agentRemove');
});
```

An agent may also be used for an individual request. By providing {agent: false} as an option to the http.get() or http.request() functions, a one-time use Agent with default options will be used for the client connection.

agent:false:

```
http.get({
  hostname: 'localhost',
  port: 80,
  path: '/',
  agent: false  // create a new agent just for this one request
}, (res) => {
  // Do stuff with response
});
```


### new Agent([options])

The default http.globalAgent that is used by http.request() has all of these values set to their respective defaults.

To configure any of them, a custom http.Agent instance must be created.

```
const http = require('http');
const keepAliveAgent = new http.Agent({ keepAlive: true });
options.agent = keepAliveAgent;
http.request(options, onResponseCallback);

```

#### agent.createConnection(options[, callback])

#### agent.keepSocketAlive(socket)

#### agent.reuseSocket(socket, request)

#### agent.destroy()

#### agent.freeSockets

#### agent.getName(options)

#### agent.maxFreeSockets

#### agent.maxSockets

#### agent.requests

#### agent.sockets



### Class: http.ClientRequest

このオブジェクトは内部的に作られるもので、http.request()から返されます
ヘッダがキューに既に入れられているリクエストの進行中の状態を表します
// representsは文頭なのでRは大文字な気がする？
// represents an in-progress request whose header has already been queued.

ヘッダはsetHeader() getHeader() removeHeader()APIを利用して変更可能です

実際のヘッダは最初のデータチャンクと一緒に送信されるか、request.end()を呼び出す時に送信されます。

レスポンスを取得するには、requestオブジェクトにresponseリスナーを追加します。
'response'はリクエストオブジェクトから、レスポンスヘッダーを受け取った際に発行されます

'response'イベントはhttp.IncomingMessageのインスタンスの１つの引数で実行されます
// ちょっとわからんのであとで試す

'response'イベント中、レスポンスオブジェクトにリスナーを追加することが出来ます。
特にdataイベントをlistenできます。

'response'ハンドラが追加されない場合、レスポンスは完全に破棄されることになります。

しかし、'response'ハンドラが追加された場合、レスポンスオブジェクトからはのデータは必ず消費されなければなりません。
readableイベントが有る場合は必ずresponse.read()を呼び出すか、dataハンドラを追加するか、.resume()関数を呼ぶかして、必ず消費されます。
データが消費されるまで必ずendイベントは発生しません。
// っていうのを試せと言われそうな気がする

同様に、データが読み取られるまでの間メモリを消費し、最終的にはprocess out of memoryエラーが発生する可能性があります。

Note: Node.jsはContent-Lengthと送信されたbodyのlengthが等しいかどうかをチェックしません


request要素は書き込み可能なストリームのインターフェースを実装しています。
これは以下のイベントをもつEventEmitterです。

イベント:
- abort
- connect
- continue
- response
- socket
- timeout
- upgrade

#### Event: 'abort'

リクエストがクライアントによってabortされたときに送信されます。このイベントはabort()の最初の呼び出しでのみ発生します。

// todo あとでテストコードを読んで見る

#### Event: 'connect'

サーバがリクエストに対して応答するたびに発生します。
このイベントがlistenされていない場合、CONNECTメソッドを受信したクライアントのコネクションは閉じられます

'connect'イベントをリッスンする方法のクライアントとサーバのデモを下に示します。

```
// connect_demo.js
const http = require('http');
const net = require('net');
const url = require('url');

// Create an HTTP tunneling proxy
const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, cltSocket, head) => {
  // connect to an origin server
  const srvUrl = url.parse(`http://${req.url}`);
  const srvSocket = net.connect(srvUrl.port, srvUrl.hostname, () => {
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    srvSocket.write(head);
    srvSocket.pipe(cltSocket);
    cltSocket.pipe(srvSocket);
  });
});

// now that proxy is running
proxy.listen(1337, '127.0.0.1', () => {

  // make a request to a tunneling proxy
  const options = {
    port: 1337,
    hostname: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80'
  };

  const req = http.request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('got connected!');

    // make a request over an HTTP tunnel
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```


#### Event: 'continue'

通常、リクエストに'Expect: 100-continue'が含まれているといった理由で、100 ContinueのHTTPレスポンスをサーバ側が送った時に送信されます。
これは、クライアントがリクエストボディーを送る必要があるという命令です。

#### Event: 'response'

このリクエストに対するレスポンスが受け取られたという時に発します。
このイベントは１回だけ発生します。


#### Event: 'socket'

このリクエストに対するsocketが割り当てられた後に送信されます。

#### Event: 'timeout'

根底にあるsocketが活動していなくてタイムアウトになったときに送信されます。


This only notifies that the socket has been idle. The request must be aborted manually.
これはSocketがアイドル状態であることを通知するだけです。
requestは手動で中止擦る必要があります。

request.setTimeoutも御覧ください。

#### Event: 'upgrade'

サーバがリクエストをアップグレードするのに応答するたびに送信されます。
このイベントがリッスンされていないとき、アップグレードヘッダーを受信するクライアントの接続は閉じられます。

upgradeイベントをlistenするクライアントとサーバのデモは下のとおりです。


```
// upgrade_demo.js
const http = require('http');

// Create an HTTP server
const srv = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
srv.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // echo back
});

// now that server is running
srv.listen(1337, '127.0.0.1', () => {

  // make a request
  const options = {
    port: 1337,
    hostname: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket'
    }
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
    socket.end();
    process.exit(0);
  });
});
```

#### request.abort()
リクエストが中止だとマークします。
これを読んだ場合、レスポンスの残りのデータは破棄されて、Socketは壊されます。


#### request.aborted

要求が中止された場合、この値は 1 January 1970 00:00:00 UTC.からの経過時刻です。


#### request.connection

request.socketをみてね

#### request.end([data[, encoding]][, callback])

リクエストの終了を送信します。
bodyのどこかの部分が送信されていない場合、それらをストリームに流します。
もしリクエストがチャンクの場合、'0\r\n\r\n'.の終了を送信します。

dataが指定されている場合、request.write()を呼び出してからrequest.end()擦るのと同じことです。

callbackが指定されている場合、リクエストのストリームが終了したときに呼び出されます。


#### request.flushHeaders()
リクエストのヘッダーをflushします

効率上の理由から、Node.jsでは通常request.end()が呼び出されるか、最初のチャンクが書き込まれるまで、リクエストヘッダはバッファされます。

次に、リクエストヘッダーとデータをひとつのTCPパケットに詰め込もうとします。
// ??? It then tries to pack the request headers and data into a single TCP packet.

これは、通常（それはTCPラウンドトリップとして保存されて）必要ですが、最初のデータがあとになるまで送信されない場合があります？
// That's usually desired (it saves a TCP round-trip), but not when the first data is not sent until possibly much later.

request.flushHeaders()は最適化にバイパスし、リクエストをキックスタートします。

#### request.getHeader(name)

リクエストのヘッダを読みます。
注意として、名前の大文字小文字が区別されないことに気をつけてください。


#### request.removeHeader(name)

ヘッダーオブジェクトに既に定義済みのヘッダーを消去します。
例：
```

request.removeHeader('Content-Type');

```


#### request.setHeader(name, value)

ヘッダーオブジェクトに１つのヘッダーをセットします。
このヘッダーが送信擦る予定のヘッダーに既に存在する場合、置き換えます。

ここでは文字列の配列を利用して、同じ名前のヘッダーを複数送信します。

例:

```
request.setHeader('Content-Type', 'application/json');

```

or

```
request.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```



#### request.setNoDelay([noDelay])

リクエストにSocketが割り当てられ、接続されるとsocket.setNoDelayが呼ばれます。


#### request.setSocketKeepAlive([enable][, initialDelay])

リクエストにSocketが割り当てられ、接続するとsocket.setKeepAlive()が呼ばれます。

#### request.setTimeout(timeout[, callback])

リクエストにSocketが割り当てられ、接続するとsocket.setTimeout()が呼ばれます。

#### request.socket

ベースのsocketを参照してください。

通常、ユーザーはこのプロパティにアクセスすることを望みません。
特に、SocketはどのようにプロトコルパーサがSocketに接続するかということによっては'readable'なイベントを送信しないからです(?)

// In particular, the socket will not emit 'readable' events because of how the protocol parser attaches to the socket.

response.end()の後、このプロパティはnullになります。
Socketはrequest.connectionを通してアクセスすることもできます

Example:
```
// req_socket.js
const http = require('http');
const options = {
  host: 'www.google.com',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`Your IP address is ${ip} and your source port is ${port}.`);
  // consume response object
});
```

#### request.write(chunk[, encoding][, callback])

bodyのチャンクを送ります。
このメソッドを何度も呼び出すことによって、リクエストの本体をサーバに送ることが出来ます。
その場合、リクエストを作成するときは、 ['Transfer-Encoding', 'chunked'] headerを付与することをおすすめします。

encoding引数はオプショナルで、chunkが文字列の場合にのみ有効です。
デフォルトはutf8です。

callback引数もオプショナルで、このデータのチャンクがflushされるときに呼び出されます

この関数は返り値にrequestを返します。



### Class: http.Server

This class inherits from net.Server and has the following additional events:

#### Event: 'checkContinue'

#### Event: 'checkExpectation'

#### Event: 'clientError'

#### Event: 'close'

#### Event: 'connect'

#### Event: 'connection'

#### Event: 'request'

#### Event: 'upgrade'

#### server.close([callback])

#### server.listen()

#### server.listening

#### server.maxHeadersCount

#### server.setTimeout([msecs][, callback])

#### server.timeout

#### server.keepAliveTimeout



### Class: http.ServerResponse

#### Event: 'close'

#### Event: 'finish'

#### response.addTrailers(headers)

This method adds HTTP trailing headers (a header but at the end of the message) to the response.

Trailers will only be emitted if chunked encoding is used for the response; if it is not (e.g. if the request was HTTP/1.0), they will be silently discarded.

Note that HTTP requires the Trailer header to be sent in order to emit trailers, with a list of the header fields in its value. E.g.,

```
response.writeHead(200, { 'Content-Type': 'text/plain',
                          'Trailer': 'Content-MD5' });
response.write(fileData);
response.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
response.end();
```
Attempting to set a header field name or value that contains invalid characters will result in a TypeError being thrown.



#### response.connection



#### response.end([data][, encoding][, callback])


#### response.finished

#### response.getHeader(name)


#### response.getHeaderNames()

#### response.getHeaders()

#### response.hasHeader(name)

#### response.headersSent

#### response.removeHeader(name)

#### response.sendDate

#### response.setHeader(name, value)

#### response.setTimeout(msecs[, callback])

#### response.socket

#### response.statusCode

#### response.statusMessage

#### response.write(chunk[, encoding][, callback])

#### response.writeContinue()

#### response.writeHead(statusCode[, statusMessage][, headers])



### Class: http.IncomingMessage
An IncomingMessage object is created by http.Server or http.ClientRequest and passed as the first argument to the 'request' and 'response' event respectively. It may be used to access response status, headers and data.

It implements the Readable Stream interface, as well as the following additional events, methods, and properties.


#### Event: 'aborted'

#### Event: 'close'

#### message.destroy([error])

#### message.headers

####

####

####

####






####

####

####

####

####

####

####

####

#### 参考
http://html5.ohtsu.org/nodejuku01/nodejuku01_ohtsu.pdf
http://www.slideshare.net/shigeki_ohtsu/processnext-tick-nodejs
http://info-i.net/buffer
