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

エージェントはHTTPクライアントのコネクションの永続性と再利用を管理する責任をもっています。

これは与えられたホストとポートに対する保留しているリクエストのキューを維持し、キューが空になるまで一つのソケットのコネクションを再利用します。
ソケットは破棄されるか、プールに入れられ同じホストとポートに対するリクエストに対して再利用するために保持されます。
破棄されるかプールされるかは、keepAliveオプションに依存します。

プールされたコネクションは、TCP Keep-Aliveが有効になっている状態ですが、しかしサーバはアイドル状態の接続を閉じているかもしれません。
そのようなケースの場合、プールから削除され、そのホストやポートからの新しいHTTPリクエストがあった場合に、新しいコネクションがはられます。

サーバは、同じコネクションからの複数のリクエストを許可しないことがあります。
そのような場合、コネクションはすべてのリクエストに対して再度作成する必要があり、プールすることはできません。

エージェントはそのサーバへのリクエストをしますが、新しいコネクションを都度発生します。

コネクションがクライアントかサーバによって閉じられたとき、プールから削除されます。
プールにある使われていないソケットは、未解決のリクエストがないときに、Node.jsのプロセスを実行しないようにするためにunrefedな状態を保ちます。
// ?? Any unused sockets in the pool will be unrefed so as not to keep the Node.js process running when there are no outstanding requests. (see socket.unref()).

グッドプラクティスとしては、使われていないソケットはOSのリソースを消費してしまうので、利用していないエージェントのインスタンスはdestroy()するほうがいいです。

ソケットは、closeイベントかagentRemoveイベントが呼ばれるとエージェントによって削除されます。

1つのHTTPリクエストを、エージェントに保持しないで長い間開いたまま保持すると、以下のような状態になります

```
// agent_remove.js
http.get(options, (res) => {
  // Do stuff
}).on('socket', (socket) => {
  socket.emit('agentRemove');
});
```

エージェントは同じように個々のリクエストにも使えます。
`{agent: false}`をhttp.get()かhttp.request()関数のオプションとして渡した場合、クライアント説奥に１回限りで使えるエージェントが使えます。


agent:false: ←これは一体・・・

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


http.request()で利用されるデフォルトのhttp.globalAgentは、これらの値がそれぞれデフォルトで設定されています。

これらををいじる場合は、カスタムhttp.Agentのインスタンスを作成する必要があります。

```
// customAgent.js
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

このクラスはnet.Serverから継承されていて、以下の追加されたイベントを持っています
This class inherits from net.Server and has the following additional events:

#### Event: 'checkContinue'

`HTTP Expect: 100-continue`を受け取るたびに送信されます。
このイベントをlistenしていない場合、サーバは自動的に`100 Continue`を返します。

このイベントを処理するためには、クライアント側が送信を続ける必要がある場合はresponse.writeContinue()を呼び出し、クライアント側がリクエストボディを送信し続ける必要がない場合は`400 Bad Request`のような適切なHTTP レスポンスを返すべきです。

注意：このイベントが送信されたり処理される場合は、requestイベントは送信されないことに注意してください。

#### Event: 'checkExpectation'

100-continueではないHTTP Expectヘッダーを受け取った場合に送信されます。
このイベントがlistenされていない場合、サーバは自動的に417 Expectation Failedを返します。

注意：このイベントが送信されたり処理される場合は、requestイベントは送信されないことに注意してください。


#### Event: 'clientError'

クライアント接続がerrorイベントを送信した場合にこのイベントになります。

このイベントのリスナーはソケットを閉じたり、破棄したりする責任を持ちます

例えば、突然接続を切断する代わりに、`'400 Bad Request'`レスポンスを使うことでソケットをよりよく閉じることが出来ます。

デフォルトの動作は、不正なリクエストはすぐにソケットを破棄します。

ソケットはエラーが発生したnet.Socketオブジェクトです。

```
const http = require('http');

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
```

`clientError`イベントが発生した時、リクエスト/レスポンスオブジェクトは存在しないので、レスポンスヘッダとペイロードを含むHTTPのレスポンスはすべて、直接ソケットオブジェクトに書き込む必要があります。

HTTPレスポンスメッセージは適切にフォーマットされてたものであることを確実にするために注意してください。


#### Event: 'close'

サーバが閉じられる時に送信されます。


#### Event: 'connect'

クライアントがHTTP CONNECTメソッドを要求するたびに送信されます。
このイベントがlistenされていない場合、CONNECTメソッドを要求するクライアントのリクエストのコネクションはクローズされます

このイベントが送信された後、リクエストのソケットはdataイベントリスナーは持っていません。
つまり、これの意味するところ、ソケット上のサーバに送信されたデータを処理するためにはデータをバインドする必要があります。


#### Event: 'connection'

新しいTCPのストリームが確立された時です。socketはnet.Socketのオブジェクトです。


// ここだけいきなりWhen~なので( When a new TCP stream is established. )ほかのにあわせて
// -> Emitted when a new TCP stream is established.に変更しても良い気がしなくもない

普通、ユーザーはこのイベントにアクセスしたくはありません。
特に、ソケットは、プロトコルパーサーがソケットにどのように接続するかに応じて`readable`イベントは発生しません。

ソケットは同じようにrequest.connectionでもアクセスできます

#### Event: 'request'

リクエストされたときに毎回送信されます。
注意：接続ごとに複数のリクエストが存在する可能性があることに注意してください（HTTP Keep-Aliveのような場合）


#### Event: 'upgrade'

クライアントがHTTP upgradeをリクエストした場合に毎回送信されます。
このイベントがlistenされていない場合、upgradeを要求したクライアントは、コネクションが閉じられます。


このイベントが送信された後、リクエストのソケットはdataイベントリスナーは持っていません。
つまり、これの意味するところ、ソケット上のサーバに送信されたデータを処理するためにはデータをバインドする必要があります。

#### server.close([callback])

新しいコネクションを受け入れるのをやめます。
net.Server.close()をみてね。

#### server.listen()

HTTPサーバは新しいコネクションのlistenをはじめます。
これはnet.Serverのserver.listen()と同じです。


#### server.listening

サーバが接続を待機しているかの真偽値です。


#### server.maxHeadersCount

ヘッダーの最大受信数です。デフォルトは2000です。

0を設定した場合制限はありません。


#### server.setTimeout([msecs][, callback])

Socketのタイムアウトの値を設定し、タイムアウトが発生した場合に、
Socketを引数として渡し、Serverオブジェクトに対して`timeout`イベントを送信します。

Serverオブジェクトの`timeout`イベントに対するリスナーがある場合、タイムアウトSocketを引数として呼び出されます。

デフォルトではサーバのタイムアウト値は２分で、Socketはタイム・アウトすると自動的に破棄されます。
しかし、サーバのtimeoutイベントにcallbackがある場合、タイムアウトは明示的に処理しないといけません。
serverを返します。


#### server.timeout

タイムアウトしたと考えられるまでに時間の値（ミリ秒）

0を値として入れた場合、タイムアウトの動作は無効化されます。

注意： Socketのタイムアウトのロジックは接続時にセットアップされるので、この値を変更したときは新しいコネクションにのみ影響して、既に接続されているコネクションには影響しません


#### server.keepAliveTimeout

最後にレスポンスを受け取ってから、Socketが破棄されるまでの、サーバが追加のデータをまつために待機するためのミリ秒です。

keepAliveTimeoutが発火する前にサーバが新しいデータを受信すると、server.timeoutのタイムアウトがリセットされます。

0を値として入れた場合、keep-aliveのタイムアウトの動作は無効化されます。

注意： Socketのタイムアウトのロジックは接続時にセットアップされるので、この値を変更したときは新しいコネクションにのみ影響して、既に接続されているコネクションには影響しません

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

#### message.httpVersion

#### message.method

#### message.rawHeaders

#### message.rawTrailers

#### message.setTimeout(msecs, callback)

#### message.socket

#### message.statusCode

#### message.statusMessage

#### message.trailers

#### message.url

#### http.METHODS

#### http.STATUS_CODES

#### http.createServer([requestListener])

#### http.get(options[, callback])

Since most requests are GET requests without bodies, Node.js provides this convenience method. The only difference between this method and http.request() is that it sets the method to GET and calls req.end() automatically. Note that the callback must take care to consume the response data for reasons stated in http.ClientRequest section.

The callback is invoked with a single argument that is an instance of http.IncomingMessage

JSON Fetching Example:

```
http.get('http://nodejs.org/dist/index.json', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // consume response data to free up memory
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
```

#### http.globalAgent


#### http.request(options[, callback])

Node.js maintains several connections per server to make HTTP requests. This function allows one to transparently issue requests.

options can be an object, a string, or a URL object. If options is a string, it is automatically parsed with url.parse(). If it is a URL object, it will be automatically converted to an ordinary options object.

The optional callback parameter will be added as a one time listener for the 'response' event.

http.request() returns an instance of the http.ClientRequest class. The ClientRequest instance is a writable stream. If one needs to upload a file with a POST request, then write to the ClientRequest object.

Example:

```
const postData = querystring.stringify({
  'msg': 'Hello World!'
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// write data to request body
req.write(postData);
req.end();
```

####

#### 参考

- 新しいプログラミング言語の学び方  HTTPサーバーを作って学ぶ  Java, Scala, Clojure
 - https://speakerdeck.com/todokr/xin-siihurokuraminkuyan-yu-falsexue-hifang-httpsahawozuo-tutexue-hu-java-scala-clojure