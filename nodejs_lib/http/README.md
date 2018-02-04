# notes
https://nodejs.org/api/crypto.html の読み物です。

## Node.js v8.9.3 Documentation

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

HTTPのリクエストに使われるsocket/streamのコネクションを作成します。

デフォルトではこの関数はnet.createConnectionと同じ動作をします。しかし、より柔軟な対応が求められるケースでは、カスタムエージェントでこのメソッドをオーバーライドすることができます
// ?? However, custom agents may override this method in case greater flexibility is desired.

// A socket/stream can be supplied in one of two ways: by returning the socket/stream from this function, or by passing the socket/stream to callback.

socket/streamは2つの方法で供給できます。
1つはこの巻数からsocket/streamを返す方法で、もう一つはsocket/streamをコールバックに

コールバックは(err, stream)の性質を持っています



#### agent.keepSocketAlive(socket)


Socketがリクエストから離れたときに呼ばれます。そしてエージェントによって永続化される可能性があります。

デフォルトは以下の通りです。

```
socket.setKeepAlive(true, this.keepAliveMsecs);
socket.unref();
return true;
```

#### agent.reuseSocket(socket, request)

リクエストにソケットがアタッチされたときに呼ばれ、keep-aliveオプションによって永続化されます。

デフォルトの動作は以下です。

```
socket.ref();
```

#### agent.destroy()

エージェントによって今使われているsocketを全てdestroyします。

普段使う必要はありません。
ただし、keepAliveを有効にしているエージェントを使っている場合、エージェントが利用されなくなった場合には明示的にシャットダウンすることがベストです。
そうしない場合、サーバがそれらのSocketを終了する前にsocketがハングアップする可能性があります。



#### agent.freeSockets

keepAliveが有効な場合、エージェントが使っているSocketの配列を含むオブジェクトになります。
変更しないで下さい。



#### agent.getName(options)

接続を再利用することが可能かどうか判断するために、requestオプションにセットされたユニークなnameを取得します。
HTTPエージェントの場合はhost:port:localAddress または host:port:localAddress:familyを返し、
HTTPSエージェントの場合は
the CA, cert, ciphers, and other HTTPS/TLS-specific options が含まれたものを返します



#### agent.maxFreeSockets

デフォルトは256がセットされている。
keepAliveが有効になっているエージェントの場合、開いた状態で待機しているソケットの最大数を持っています。


#### agent.maxSockets

デフォルトは無限。エージェントがorigin毎に同時に接続できるソケット数の上限をしていできます。
originはagent.getName()で返ってくる値のことを指します


#### agent.requests

まだソケットに割り当てられていないリクエストのキューを含んでいるオブジェクトです。
変更しないで下さい。

#### agent.sockets

エージェントによって現在利用されているソケットを含んでいるオブジェクトです
変更しないで下さい。


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

// connect event時に同時に説明する

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


これは、通常（それはTCPラウンドトリップとして保存されて）必要ですが、最初のデータがあとになるまで送信されないときがあるからです
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

このオブジェクトは、ユーザーからではなくHTTPサーバの内部で生成されます。 -> [ここ](https://github.com/nodejs/node/blob/master/lib/_http_server.js#L581)
2つめのパラメータとして、requestイベントに渡されます。

レスポンスは、Writable Streamのインターフェースを実装しますが、それは継承されていません。
これは以下のイベントをもつEventEmitterです


#### Event: 'close'

response.end()が呼ばれるか、flushできるようになる前に、接続が終了したことを示すために呼ばれるイベント


#### Event: 'finish'

Responseが送信されたあとに送信されるイベント。

具体的には、レスポンスヘッダとボディの最後のセグメントが（ネットワーク経由で？）OSに送信されたときにこのイベントは送信されます。

これは、クライアントがなにかを受け取ったことを示すものではありません。

このイベントの後には、これ以上レスポンスオブジェクトのイベントは発火しません。


#### response.addTrailers(headers)

このメソッドはレスポンスにHTTPのtrailerヘッダを追加します。
（trailerヘッダはHTTPの末尾に追加されます）// ??  (a header but at the end of the message)

トレイラーはチャンクエンコーディングがレスポンスに利用されている場合のみ付与されます。
利用されていない場合（例えばHTTP/1.0）、これらは暗黙的に破棄されます。


注意：HTTPでは、トレイラーを送信するためには、トレイラーヘッダを送信する必要があり、ヘッダーのフィールドのリストにその値を入れる必要があります。
例えば以下

```
response.writeHead(200, { 'Content-Type': 'text/plain',
                          'Trailer': 'Content-MD5' });
response.write(fileData);
response.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
response.end();
```

無効な文字を含むフィールド名や値をヘッダーにセットしようとすると、TypeErrorがスローされることになります。

#### response.connection

[response.socket](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_response_socket)を参照


#### response.end([data][, encoding][, callback])

このメソッドは、レスポンスのヘッダとボディが全てサーバに送られたとサーバへ通知するものです。
サーバはこのメッセージを完了したものと考えるべきです。

response.end()メソッドは、どのレスポンスでも必ず呼ばれます。

データが指定されている場合、response.writeが呼ばれ、その後にresponse.end(callback)されるのと同じです。


callbackが指定されている場合は、responseのstreamが終了した時にcallbackは呼び出されます。


#### response.finished

レスポンスが完了したかどうかのBooleanの値です。
falseで始まり、response.end()が呼ばれた後にtrueになります
// TODO あとで試す


#### response.getHeader(name)

既にqueueにあるが、クライアントに送信されていないヘッダーをリードします。

注意：nameは大文字小文字の区別をしません

例：
```
const contentType = response.getHeader('content-type');
```

#### response.getHeaderNames()

現在送信されているヘッダーの、ユニークな名前が含まれる配列を返します。

すべてのヘッダーの名前はlowercaseになっています。

例： // getHeader.js
```
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```

#### response.getHeaders()

現在送信されているヘッダーのシャローコピーを返します。

シャローコピーが利用されるため、配列の値はHTTPモジュールのメソッドへの追加の呼び出しが行われることなく、変化する可能性があります。

返されたオブジェクトのキーは、ヘッダー名で、その値はそのヘッダーの値です。
すべてのヘッダー名はlowercaseです

注意：response.getHeaders()メソッドで返されるオブジェクトは、prototypically(?)なJavaScript Objectからは継承されていません。
つまり、toString()/hasOwnProperty()やその他のメソッドは定義されておらず、利用できません。

例：// getHeader.js(上と同じ)
```
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```


#### response.hasHeader(name)

現在送信されているヘッダに、nameが存在すればtrueが帰ります。

注意：この場合header nameは大文字小文字の区別をしません

例： // getHeader.jsと同じ
```
const hasContentType = response.hasHeader('content-type');

```
#### response.headersSent

リードオンリーなbooleanです。送られていたらtrue,それ以外ならfalseが返ります。

#### response.removeHeader(name)

queueに入っているヘッダーを削除します。 // ??? for implicit sending.

例:
```
response.removeHeader('Content-Encoding');
```


#### response.sendDate

trueの場合、（Dateヘッダが存在しない場合）Dateヘッダが自動的に生成されて送信されます。

デフォルトはtrueです。

これはテストする時にのみ無効にすべきで、HTTPではresponseにDateヘッダが必要です。

#### response.setHeader(name, value)

Sets a single header value for implicit headers. If this header already exists in the to-be-sent headers, its value will be replaced. Use an array of strings here to send multiple headers with the same name.

例：
```
response.setHeader('Content-Type', 'text/html');

```
or
```
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);

```

Attempting to set a header field name or value that contains invalid characters will result in a TypeError being thrown.

When headers have been set with response.setHeader(), they will be merged with any headers passed to response.writeHead(), with the headers passed to response.writeHead() given precedence.

```
// returns content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```

#### response.setTimeout(msecs[, callback])
Sets the Socket's timeout value to msecs. If a callback is provided, then it is added as a listener on the 'timeout' event on the response object.

If no 'timeout' listener is added to the request, the response, or the server, then sockets are destroyed when they time out. If a handler is assigned to the request, the response, or the server's 'timeout' events, timed out sockets must be handled explicitly.

Returns response.

#### response.socket

Reference to the underlying socket. Usually users will not want to access this property. In particular, the socket will not emit 'readable' events because of how the protocol parser attaches to the socket. After response.end(), the property is nulled. The socket may also be accessed via response.connection.

例：
```
const http = require('http');
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```


#### response.statusCode

When using implicit headers (not calling response.writeHead() explicitly), this property controls the status code that will be sent to the client when the headers get flushed.



例：
```
response.statusCode = 404;
```

#### response.statusMessage
When using implicit headers (not calling response.writeHead() explicitly), this property controls the status message that will be sent to the client when the headers get flushed. If this is left as undefined then the standard message for the status code will be used.

例:
```
response.statusMessage = 'Not found';
```


#### response.write(chunk[, encoding][, callback])

If this method is called and response.writeHead() has not been called, it will switch to implicit header mode and flush the implicit headers.

This sends a chunk of the response body. This method may be called multiple times to provide successive parts of the body.

Note that in the http module, the response body is omitted when the request is a HEAD request. Similarly, the 204 and 304 responses must not include a message body.

chunk can be a string or a buffer. If chunk is a string, the second parameter specifies how to encode it into a byte stream. By default the encoding is 'utf8'. callback will be called when this chunk of data is flushed.

Note: This is the raw HTTP body and has nothing to do with higher-level multi-part body encodings that may be used.

The first time response.write() is called, it will send the buffered header information and the first chunk of the body to the client. The second time response.write() is called, Node.js assumes data will be streamed, and sends the new data separately. That is, the response is buffered up to the first chunk of the body.

Returns true if the entire data was flushed successfully to the kernel buffer. Returns false if all or part of the data was queued in user memory. 'drain' will be emitted when the buffer is free again.

#### response.writeContinue()

Sends a HTTP/1.1 100 Continue message to the client, indicating that the request body should be sent. See the 'checkContinue' event on Server.

#### response.writeHead(statusCode[, statusMessage][, headers])

Sends a response header to the request. The status code is a 3-digit HTTP status code, like 404. The last argument, headers, are the response headers. Optionally one can give a human-readable statusMessage as the second argument.

例:
```
const body = 'hello world';
response.writeHead(200, {
  'Content-Length': Buffer.byteLength(body),
  'Content-Type': 'text/plain' });
```

This method must only be called once on a message and it must be called before response.end() is called.

If response.write() or response.end() are called before calling this, the implicit/mutable headers will be calculated and call this function.

When headers have been set with response.setHeader(), they will be merged with any headers passed to response.writeHead(), with the headers passed to response.writeHead() given precedence.

```
// returns content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```

Note that Content-Length is given in bytes not characters. The above example works because the string 'hello world' contains only single byte characters. If the body contains higher coded characters then Buffer.byteLength() should be used to determine the number of bytes in a given encoding. And Node.js does not check whether Content-Length and the length of the body which has been transmitted are equal or not.

Attempting to set a header field name or value that contains invalid characters will result in a TypeError being thrown.



### Class: http.IncomingMessage

IncomingMessageオブジェクトはhttp.Serverかhttp.ClientRequestから作成されます。
また、最初の引数にはrequestもしくはresponseイベントが渡されます。
これは、レスポンスデータやヘッダ、データにアクセスするのに利用されます。

Readable Streamのインターフェースと、以下の追加されたイベントやメソッド、プロパティが含まれています。


#### Event: 'aborted'

requestが中止され、ネットワークのSocketが閉じられた時に発火します。


#### Event: 'close'

コネクションが閉じられたことを示します。
これはendイベントのようですが、このイベントは1レスポンスに対して1回しか発生しません。


#### message.destroy([error])

IncomingMessageを受け取ったSocketでdestroy()を呼びます。

もしエラーが渡された場合、エラーイベントが生成され、そしてエラーはイベントのリスナーに引数として渡されます


#### message.headers

requestかresponseのヘッダーオブジェクトです。

ヘッダーの名前と値key-valueのペアで、ヘッダーの名前はlower-caseになっています。

例:
```
// Prints something like:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```

生のヘッダが重複していた場合、以下のようにヘッダ名に応じて処理されます。

- age, authorization, content-length, content-type, etag, expires, from, host, if-modified-since, if-unmodified-since, last-modified, location, max-forwards, proxy-authorization, referer, retry-after, user-agentは破棄されます。
- set-cookieはいつでも配列で、重複した場合はarrayに追加されます。
- これら以外のヘッダーは、重複した場合値はすべて,(カンマ)で追加されます

※ ↑ cookie足りてない・・・？

--
※ 表にすると以下


| Header | flag | 重複時の挙動 |
|:-----------|:------------:|:------------:|
| transfer-encoding , date ... field / 独自ヘッダ | 0 | カンマ区切り |
| set-cookie | 1 | Arrayにpush |
| cookie | 2 | セミコロンで区切ってつなげる |
| content-type, user-agent ... expires | 3 | 一つ目の値を優先的に利用（2個め以降を破棄） |


#### message.httpVersion

サーバリクエストの場合、クライアントから送信されたHTTPのバージョン。
クライアントのレスポンスの場合、接続先のサーバのHTTPのバージョン。
おそらく、1.1 もしくは 1.0です。

また、message.httpVersionMajorは最初の整数で、message.httpVersionMinorは2爪の整数です。

#### message.method

http.Serverからのリクエストのみ有効。
リクエストメソッドはStringで、リードオンリーです。

例: 'GET', 'DELETE'.

#### message.rawHeaders

request/responseの生のヘッダーで、受け取った通り正確に表示されます。


注意：keyとvalueが同じ配列（list）の中にいます

タプルのリストではないです // ?It is not a list of tuples.

よって、偶数番目にあるものはkeyで、奇数番目にあるものがvalueとなっています。

ヘッダー名はlowercaseではなく、重複しているものもマージされていません。

```
// Prints something like:
//
// [ 'user-agent',
//   'this is invalid because there can be only one',
//   'User-Agent',
//   'curl/7.22.0',
//   'Host',
//   '127.0.0.1:8000',
//   'ACCEPT',
//   '*/*' ]
console.log(request.rawHeaders);
```

#### message.rawTrailers

生のrequest/responseのtrailerのkeyとvalueです。それらは受信したとおりのものです。
endイベントでのみ設定できます。
//TODO:あとでためす

#### message.setTimeout(msecs, callback)

message.connection.setTimeoutを呼び出します
messageを返します。

#### message.socket

コネクションに関連付けされたnet.Socketオブジェクトです。

HTTPSをサポートしている場合は、request.socket.getPeerCertificate()を利用してクライアント認証の詳細を取得します。

#### message.statusCode

http.ClientRequestからのリクエストのみ有効です。

404みたいな3桁のHTTPのステータスコードです。

#### message.statusMessage

http.ClientRequestからのリクエストのみ有効です。
OKやInternal Server Errorのような、HTTPレスポンスのステータスメッセージです

#### message.trailers

request/responseのtrailerオブジェクト。endイベントでのみ設定されます。

#### message.url

http.Serverからのリクエストのみ有効です。

requestのURLの文字列。実際のHTTPリクエストに存在するURLのみが含まれます

例えばリクエストが以下のような
```
GET /status?name=ryan HTTP/1.1\r\n
Accept: text/plain\r\n
\r\n
```

ときには、request.urlはこんな感じに

```
'/status?name=ryan'
```

URLをパースするには、require('url').parse(request.url)を利用することが出来ます。
例えば：

```
$ node
> require('url').parse('/status?name=ryan')
Url {
  protocol: null,
  slashes: null,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  hash: null,
  search: '?name=ryan',
  query: 'name=ryan',
  pathname: '/status',
  path: '/status?name=ryan',
  href: '/status?name=ryan' }
```

クエリストリングからパラメータを抽出するには、require('querystring').parse関数を用いるか、またrequire('url').parseの第二引数にtrueを渡すことでできます。

例:

```
$ node
> require('url').parse('/status?name=ryan', true)
Url {
  protocol: null,
  slashes: null,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  hash: null,
  search: '?name=ryan',
  query: { name: 'ryan' },
  pathname: '/status',
  path: '/status?name=ryan',
  href: '/status?name=ryan' }
```



#### http.METHODS

パーサーがサポートしている、HTTPメソッドのリスト

#### http.STATUS_CODES

標準的なHTTPレスポンスのステータスコードと、その短い説明の一覧

例えばhttp.STATUS_CODE[404]はNot Found


```

> http.STATUS_CODES
{ '100': 'Continue',
  '101': 'Switching Protocols',
  '102': 'Processing',
  '200': 'OK',
  '201': 'Created',
  '202': 'Accepted',
  '203': 'Non-Authoritative Information',
  '204': 'No Content',
  '205': 'Reset Content',
  '206': 'Partial Content',
  '207': 'Multi-Status',
  '208': 'Already Reported',
  '226': 'IM Used',
  '300': 'Multiple Choices',
  '301': 'Moved Permanently',
  '302': 'Found',
  '303': 'See Other',
  '304': 'Not Modified',
  '305': 'Use Proxy',
  '307': 'Temporary Redirect',
  '308': 'Permanent Redirect',
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '402': 'Payment Required',
  '403': 'Forbidden',
  '404': 'Not Found',
  '405': 'Method Not Allowed',
  '406': 'Not Acceptable',
  '407': 'Proxy Authentication Required',
  '408': 'Request Timeout',
  '409': 'Conflict',
  '410': 'Gone',
  '411': 'Length Required',
  '412': 'Precondition Failed',
  '413': 'Payload Too Large',
  '414': 'URI Too Long',
  '415': 'Unsupported Media Type',
  '416': 'Range Not Satisfiable',
  '417': 'Expectation Failed',
  '418': 'I\'m a teapot',
  '421': 'Misdirected Request',
  '422': 'Unprocessable Entity',
  '423': 'Locked',
  '424': 'Failed Dependency',
  '425': 'Unordered Collection',
  '426': 'Upgrade Required',
  '428': 'Precondition Required',
  '429': 'Too Many Requests',
  '431': 'Request Header Fields Too Large',
  '451': 'Unavailable For Legal Reasons',
  '500': 'Internal Server Error',
  '501': 'Not Implemented',

```

#### http.createServer([requestListener])

request Listenerはrequestイベントが自動追加される関数です。

#### http.get(options[, callback])

ほとんどのリクエストはBodyなしのGETリクエストのため、Node.jsはこの便利なメソッドを提供します

このメソッドとhttp.request()の違いは、メソッドをGETに設定し、req.end()を自動で呼び出している点だけです。

参考：https://github.com/nodejs/node/blob/master/lib/http.js#L41

注意：callbackはhttp.ClientRequestのセクションに記載されているような理由で、レスポンスデータを消費するように注意しなければならないことに注意してください。

コールバックはhttp.IncomingMessageのインスタンスである、１つの引数で呼び出されます。

JSONをFetchする例：

```
// http_get.js
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

HTTPクライアントモジュールで行われるリクエストのデフォルトで使用されるAgent。
中身はAgent-> [globalAgent: new Agent()](https://github.com/nodejs/node/blob/master/lib/_http_agent.js#L359)


#### http.request(options[, callback])

Node.jsはHTTPリクエストをするためにサーバごとにいくつかのコネクションを維持します。
この機能を利用すると、透過的にリクエストを発行することが出来ます（？）

optionsはオブジェクトか文字列、もしくはURLオブジェクトが利用できます。
optionsが文字列の場合、url.parse()で自動的にパースされます。
URLオブジェクトの場合、自動的に通常のオプションオブジェクトに変換されます。

オプションで指定できるcallbackパラメータは、`response`イベントに１回限りのリスナーとして追加されます。

http.request()はhttp.ClientRequestクラスのインスタンスを返します。
このClientRequestインスタンスはWritable Streamです。
もしPOSTリクエストなどでファイルをアップロードする必要がある場合、ClientRequestオブジェクトに書き込みます。

例：

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

注意：例ではreq.end()が呼ばれている点に注意してください。
http.request()はリクエストが終了したことを示すために、常にreq.end()を呼び出さなくてはいけません。もしリクエストbodyにデータが書き込まれていなくてもです。

もしリクエストの最中にエラーが発生した場合（DNSリゾルブやTCPレベルのエラー、HTTPパースエラーなど）、返されたリクエストオブジェクトに`error`イベントが発行されます。

すべての`error`イベントと同じように、登録されていないリスナーにはエラーが投げられます

注意すべきいくつかのヘッダーがあります。

` 'Connection: keep-alive'`を送信すると、Node.jsに次のリクエストまでの間サーバのコネクションを保持するように通知がいきます。

`'Content-Length' `ヘッダを送信すると、デフォルトのchunk Encodingが無効になります。


`Expect`ヘッダーを送信すると、すぐにrequestのヘッダが返されます。
通常、`'Expect: 100-continue',`を送信する場合、continueイベントのタイムアウトとリスナーの両方がセットされているべきです。

もっと知りたい場合は RFC2616 Section 8.2.3 をみてください。

認証ヘッダを送信すると、authオプションを利用してベーシックな認証を計算されます。

URLをオプションとして使っている例:

```
const { URL } = require('url');

const options = new URL('http://abc:xyz@example.com');

const req = http.request(options, (res) => {
  // ...
});
```


####

#### 参考

- 新しいプログラミング言語の学び方  HTTPサーバーを作って学ぶ  Java, Scala, Clojure
 - https://speakerdeck.com/todokr/xin-siihurokuraminkuyan-yu-falsexue-hifang-httpsahawozuo-tutexue-hu-java-scala-clojure
