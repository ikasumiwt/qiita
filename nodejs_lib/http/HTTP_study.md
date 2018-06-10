# 概要

Node.jsにおけるHTTPモジュールはおおきく
1. Node.jsにおけるHTTPクライアント(HTTP ClientRequest)
2. Node.jsで作成するサーバ(HTTP Server)
の2つと、それを支えるAgent、OutgoingMessage、IncomingMessageという存在に分けることができる。

-----

まずはざっくり概要を書く。

まず、1.のHTTP ClientRequestは、名前の通りクライアントのリクエストとして利用することができる。

```
const http = require('http')

const option = {
  host: 'www.yahoo.co.jp',
  port: '80',
  path: '/',
  method: 'GET'
}

const req = http.request(option, (res) => {
  console.log(req)  
})

req.end()
```

上記のようなコードを書くと、HTTPのGETリクエストとして`www.yahoo.co.jp`にリクエストをすることができる。

このコードのhttp.requestメソッドを利用した際に使われているのがClientRequestというクラス(※ref1) [refs1](https://github.com/nodejs/node/blob/v8.11.2/lib/http.js#L38)


`ClientRequest`クラスは`OutgoingMessage`クラスを継承している(※ref2)
また、`OutgoingMessage`クラスは`Stream`を継承しているため(※ref3)、ClientRequestはStreamとしての機能を有している（もちろんEventEmitterも）


[ref2](https://github.com/nodejs/node/blob/v8.11.2/lib/_http_client.js#L280)
[ref3](https://github.com/nodejs/node/blob/v8.11.2/lib/_http_outgoing.js#L109)

// notes: [nodejs.orgのdoc](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_class_http_clientrequest)には
> The request implements the Writable Stream interface. This is an EventEmitter with the following events:

// と書いてあるが、実態としてはStreamクラス



------------

続いて、2のHTTP Serverは、Node.jsにおけるHTTPサーバを取り扱うクラスである

例えば、port:8080でlistenするサーバは以下のようにサーバを立てることができる


```
const http = require('http')

const server = http.createServer((req, res) => {
  console.log('response event')
})

server.listen(8080)
```


createServerメソッドは、Serverクラスを呼び出している(※ref4)

[ref4](https://github.com/nodejs/node/blob/v8.11.2/lib/http.js#L33)

Serverクラスは、net.Serverクラスを継承している(※ref5)そのため、EventEmitterも継承していることとなる。
[ref5](https://github.com/nodejs/node/blob/v8.11.2/lib/_http_server.js#L284)

--------

httpモジュールでhttpによるクライアント・サーバ利用するには、上記の2つのクラスを利用するとできるが、この２つのクラスはhttpモジュール内の以下の３つのクラスによって支えられている（httpモジュール内のみとして、net/streamなどは除く）

- [http.Agentクラス](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_class_http_agent)
- [http.OutgoingMessageクラス(docs未記載/github)](https://github.com/nodejs/node/blob/master/lib/_http_outgoing.js)
- [http.IncomingMessageクラス](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_class_http_incomingmessage)

--------

http.Agentクラスは、HTTPクライアントのコネクションの永続性・ソケットへの割当てについての責任を担っているクラス。


http.AgentクラスはEventEmitterを継承している（※ref6）

[ref6](https://github.com/nodejs/node/blob/v8.11.2/lib/_http_agent.js#L109)

デフォルトでは、globalAgentが作成され、そのAgentが利用される。

独自のAgentを利用したい場合は、ClientRequest（http.request時）に渡すoptions.agentにAgent objectを代入する必要がある。


options.agentはデフォルトでは`undefined`だが、以下の値を受け付けている
- agentに`false`を代入したとき
 - defaultAgent(この場合globalAgent)のコンストラクタを呼び出し、Agentを生成し直す(※ref7)


- agentが`null` or `undefined`の場合
 - globalAgentを利用する

- `typeof agent.addRequest !== 'function' `なとき
 - エラーにする

 [ref7](https://github.com/nodejs/node/blob/v8.11.2/lib/_http_client.js#L95-L110)


[http.request](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_http_request_options_callback)のoptions.agentではAgentを受け付けるように書いているが、Agent objectかどうかの判定は[addRequest](https://github.com/nodejs/node/blob/v8.11.2/lib/_http_agent.js#L138)が関数かどうかの判定のみである





## (0. http.Agent)

HTTP Clientのコネクションの永続性と、Clientの再利用を管理する責任を持っているクラス。
通常はglobalAgent(※1)を利用する

※1:
- https://github.com/nodejs/node/blob/master/lib/_http_client.js#L80
- https://github.com/nodejs/node/blob/master/lib/_http_agent.js#L360

// 一旦やった後なので、まとめはあとで書く


## 1. HTTP Request

クライアント(ブラウザ/curlなど)からサーバへ送られる要求(request)

Node.jsのHTTPモジュールでは[http.ClientRequest](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_class_http_clientrequest)クラスを用いてリクエストを行う。

図にすると以下のようになる。

```
                 http.ClientRequest(OutgoingMessage)
HTTP Client     -------------------------------------->     HTTPサーバ
 (Node.js)      <-------------------------------------- (Node.jsでもその他でもなんでも)
                  http.ClientResponse(IncomingMessage)
```

HTTP Client側を起点として見た時に、外に出るもの（ClientRequest）をOutgoingMessageとして
外部(HTTPサーバ)からHTTP Clientに対して入ってくるもの(ClientResponse)をIncomingMessageとして扱う。


ClientRequestクラスは[http.request()](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_http_request_options_callback)メソッドを用いると簡単に作成することが出来る。

- http.js: https://github.com/nodejs/node/blob/master/lib/http.js#L37
- _http_client.js: https://github.com/nodejs/node/blob/master/lib/_http_client.js#L63


```
// ./overview/client/client_request.js
'use strict'

const http = require('http')
const opt = {
  host: 'node-websocket-test.appspot.com',
  port: '80',
  path: '/'
}


const req = http.request(opt, (req) => {
  console.log(req) // -> http.
})

req.end()

```


/*
 callbackをもっている場合は1度だけresponseイベントが登録される
 -> https://github.com/nodejs/node/blob/master/lib/_http_client.js#L140
 このイベントはparserOnIncomingClient関数内で発火する(->tickOnSocket -> onSocketNT)
 https://github.com/nodejs/node/blob/master/lib/_http_client.js#L528
 */


## 2. HTTP Response


サーバ側から返される応答(Response)。
Noode.jsのHTTPモジュールでは[http.Server](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_class_http_server)から返される。

図にすると以下のようになる。
```
              http.ServerRequest(IncomingMessage)
ブラウザ      -------------------------------------->     HTTPサーバ
curlコマンド  <-------------------------------------- (http.Server class)
              http.ServerResponse(OutgoingMessage)
```

Responseの場合は逆に
HTTP Server側を起点として見た時に、ブラウザに返すレスポンス（ServerResponse）をOutgoingMessageとして
ブラウザ側からHTTP Serverへリクエストされるもの(ServerRequest)をIncomingMessageとして扱う。






## Node.js v8.9.3 Documentation

[docs](https://nodejs.org/dist/latest-v8.x/docs/api/http.html)

### HTTP
`Stability: 2 - Stable`





#### 参考

- [［BurpSuiteJapan］HTTP基礎入門](https://www.slideshare.net/BurpSuiteJapanUserGr/burpsuitejapanhttp)



#### memo

HTTPリクエストは以下の通り

```
// request line
> GET / HTTP/1.1  // メソッド, パス, HTTPのバージョン

// HTTP Header Fields
> Host: node-websocket-test.appspot.com // ホスト
> User-Agent: curl/7.54.0  // ユーザーエージェント
> Accept: */* // 受信可能なデータタイプ


// response line
< HTTP/1.1 200 OK  // HTTPのバージョン, ステータスコード, テキストフレーズ

// Header Fields
< Date: Sun, 18 Mar 2018 15:14:41 GMT // Dateフィールド
< Content-Type: text/html // コンテントタイプ
< Transfer-Encoding: chunked // transfer-encoding https://triple-underscore.github.io/RFC2616-ja.html#section-14.41
< Vary: Accept-Encoding // HTTP/1.1のVaryヘッダ。https://triple-underscore.github.io/RFC2616-ja.html#section-14.44, http://kiririmode.hatenablog.jp/entry/20170626/1498402800
< Via: 1.1 google // 経路が入っているヘッダ HTTP/1.1のViaヘッダ  https://triple-underscore.github.io/RFC2616-ja.html#section-14.45
```


元のcurlは以下

```
$ curl -v  node-websocket-test.appspot.com

* Rebuilt URL to: node-websocket-test.appspot.com/
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed

  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0*   Trying 216.58.197.244...
* TCP_NODELAY set
* Connected to node-websocket-test.appspot.com (216.58.197.244) port 80 (#0)
> GET / HTTP/1.1
> Host: node-websocket-test.appspot.com
> User-Agent: curl/7.54.0
> Accept: */*
>
< HTTP/1.1 200 OK
< Date: Sun, 18 Mar 2018 15:42:08 GMT
< Content-Type: text/html
< Transfer-Encoding: chunked
< Vary: Accept-Encoding
< Via: 1.1 google
<
{ [523 bytes data]

100   511    0   511    0     0   4106      0 --:--:-- --:--:-- --:--:--  4120
* Connection #0 to host node-websocket-test.appspot.com left intact
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>websocket test chat</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <div>
    <ul class="messages">
      <li> message from websocket is here</li>
    </ul>
    <input class="inputMessage" placeholder="type to here"/>
  </div>

  <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
  <!--
  <script src="/socket.io/socket.io.js"></script>
-->
  <script src="/client.js"></script>
</body>
</html>

```
