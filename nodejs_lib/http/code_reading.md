## HTTP Module code reading


よくわからなくなってくるので一旦まとめる


### http.js

元はここ：https://github.com/nodejs/node/blob/master/lib/http.js

以下のモジュールを読み込んでいる

- agent
-> [_http_agent.js](https://github.com/nodejs/node/blob/master/lib/_http_agent.js)

- { ClientRequest }
-> [_http_client.js](https://github.com/nodejs/node/blob/master/lib/_http_client.js#L80)

- common
-> [_http_common.js](https://github.com/nodejs/node/blob/master/lib/_http_common.js)

- incoming
-> [_http_incoming.js](https://github.com/nodejs/node/blob/master/lib/_http_incoming.js)

- outgoing
-> [_http_outgoing.js](https://github.com/nodejs/node/blob/master/lib/_http_outgoing.js)

- {server}
-> [_http_server.js](https://github.com/nodejs/node/blob/master/lib/_http_server.js#L263)


http.js自体には以下の3つの関数しかない



- [createServer(requestListener)](https://github.com/nodejs/node/blob/master/lib/http.js#L33)


- [request(options, cb)](https://github.com/nodejs/node/blob/master/lib/http.js#L37)

- [get(options, cb)](https://github.com/nodejs/node/blob/master/lib/http.js#L41)


module.exportsされているもの

```
module.exports = {
  _connectionListener: server._connectionListener,
  METHODS: common.methods.slice().sort(),
  STATUS_CODES: server.STATUS_CODES, // ステータスコード一覧。 https://github.com/nodejs/node/blob/master/lib/_http_server.js#L43
  Agent: agent.Agent, // Agentクラス  https://github.com/nodejs/node/blob/master/lib/_http_agent.js#L43
  ClientRequest, // ClientRequestクラス https://github.com/nodejs/node/blob/master/lib/_http_client.js#L80
  globalAgent: agent.globalAgent, // http clientでリクエストする際に管理してくれるデフォルトのAgentクラス。  中身は普通のAgent-> https://github.com/nodejs/node/blob/master/lib/_http_agent.js#L359
  IncomingMessage: incoming.IncomingMessage, // IncomingMessageクラス https://github.com/nodejs/node/blob/master/lib/_http_incoming.js#L38
  OutgoingMessage: outgoing.OutgoingMessage, // OutgoingMessageクラス https://github.com/nodejs/node/blob/master/lib/_http_outgoing.js#L69
  Server, // Serverクラス。 https://github.com/nodejs/node/blob/master/lib/_http_server.js#L263
  ServerResponse: server.ServerResponse, // ServerResponseクラス　https://github.com/nodejs/node/blob/master/lib/_http_server.js#L112
  createServer, // 上記のcreateServer関数
  get, // 同上の関数
  request // 同上の関数
};
```


#### [createServer(requestListener)](https://github.com/nodejs/node/blob/master/lib/http.js#L33)

```

function createServer(requestListener) {
  return new Server(requestListener);
}

```

requestListenerを引数にもち、new Server(requestListener);したものを返す。


Serverの本体は[ここ](https://github.com/nodejs/node/blob/master/lib/_http_server.js#L263)

関数の中身は以下
```
function Server(requestListener) {
  if (!(this instanceof Server)) return new Server(requestListener);
  net.Server.call(this, { allowHalfOpen: true });

  if (requestListener) {
    this.on('request', requestListener);
  }

  // Similar option to this. Too lazy to write my own docs.
  // http://www.squid-cache.org/Doc/config/half_closed_clients/
  // http://wiki.squid-cache.org/SquidFaq/InnerWorkings#What_is_a_half-closed_filedescriptor.3F
  this.httpAllowHalfOpen = false;

  this.on('connection', connectionListener);

  this.timeout = 2 * 60 * 1000;
  this.keepAliveTimeout = 5000;
  this._pendingResponseData = 0;
  this.maxHeadersCount = null;
}
```


Serverのインスタンスじゃない場合はnew Serverする。

net.ServerをallowHalfOpenを有効にして呼ぶ。

requestListenerを引数に持っていた場合、
Serverの[request Event](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_event_request )に登録する

this.httpAllowHalfOpenを無効にする。


connectionイベントにconnectionListenerを登録する。
connectionListenerは[ここ](https://github.com/nodejs/node/blob/master/lib/_http_server.js#L294)

// TODO ↑詳細を書く


以下の変数に初期値を登録する

```
this.timeout = 2 * 60 * 1000; // https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_server_timeout
this.keepAliveTimeout = 5000; // https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_server_keepalivetimeout
this._pendingResponseData = 0; // docsには存在しない内部用変数
this.maxHeadersCount = null; // https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_server_maxheaderscount
```


#### [request(options, cb)](https://github.com/nodejs/node/blob/master/lib/http.js#L37)


```

function request(options, cb) {
  return new ClientRequest(options, cb);
}

```

options, cbを引数にもち、new ClientRequest(options, cb);したものを返す。

ClientRequest本体は[ここ](https://github.com/nodejs/node/blob/master/lib/_http_client.js#L80)

```
function ClientRequest(options, cb) {
  OutgoingMessage.call(this);

  if (typeof options === 'string') {
    options = url.parse(options);
    if (!options.hostname) {
      throw new errors.Error('ERR_INVALID_DOMAIN_NAME');
    }
  } else if (options && options[searchParamsSymbol] &&
             options[searchParamsSymbol][searchParamsSymbol]) {
    // url.URL instance
    options = urlToOptions(options);
  } else {
    options = util._extend({}, options);
  }

  var agent = options.agent;
  var defaultAgent = options._defaultAgent || Agent.globalAgent;
  if (agent === false) {
    agent = new defaultAgent.constructor();
  } else if (agent === null || agent === undefined) {
    if (typeof options.createConnection !== 'function') {
      agent = defaultAgent;
    }
    // Explicitly pass through this statement as agent will not be used
    // when createConnection is provided.
  } else if (typeof agent.addRequest !== 'function') {
    throw new errors.TypeError('ERR_INVALID_ARG_TYPE', 'Agent option',
                               ['Agent-like Object', 'undefined', 'false']);
  }
  this.agent = agent;

  var protocol = options.protocol || defaultAgent.protocol;
  var expectedProtocol = defaultAgent.protocol;
  if (this.agent && this.agent.protocol)
    expectedProtocol = this.agent.protocol;

  var path;
  if (options.path) {
    path = String(options.path);
    var invalidPath;
    if (path.length <= 39) { // Determined experimentally in V8 5.4
      invalidPath = isInvalidPath(path);
    } else {
      invalidPath = /[\u0000-\u0020]/.test(path);
    }
    if (invalidPath)
      throw new errors.TypeError('ERR_UNESCAPED_CHARACTERS', 'Request path');
  }

  if (protocol !== expectedProtocol) {
    throw new errors.Error('ERR_INVALID_PROTOCOL', protocol, expectedProtocol);
  }

  var defaultPort = options.defaultPort ||
                    this.agent && this.agent.defaultPort;

  var port = options.port = options.port || defaultPort || 80;
  var host = options.host = validateHost(options.hostname, 'hostname') ||
                            validateHost(options.host, 'host') || 'localhost';

  var setHost = (options.setHost === undefined);

  this.socketPath = options.socketPath;
  this.timeout = options.timeout;

  var method = options.method;
  var methodIsString = (typeof method === 'string');
  if (method != null && !methodIsString) {
    throw new errors.TypeError('ERR_INVALID_ARG_TYPE', 'method',
                               'string', method);
  }

  if (methodIsString && method) {
    if (!checkIsHttpToken(method)) {
      throw new errors.TypeError('ERR_INVALID_HTTP_TOKEN', 'Method', method);
    }
    method = this.method = method.toUpperCase();
  } else {
    method = this.method = 'GET';
  }

  this.path = options.path || '/';
  if (cb) {
    this.once('response', cb);
  }

  var headersArray = Array.isArray(options.headers);
  if (!headersArray) {
    if (options.headers) {
      var keys = Object.keys(options.headers);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        this.setHeader(key, options.headers[key]);
      }
    }
    if (host && !this.getHeader('host') && setHost) {
      var hostHeader = host;

      // For the Host header, ensure that IPv6 addresses are enclosed
      // in square brackets, as defined by URI formatting
      // https://tools.ietf.org/html/rfc3986#section-3.2.2
      var posColon = hostHeader.indexOf(':');
      if (posColon !== -1 &&
          hostHeader.indexOf(':', posColon + 1) !== -1 &&
          hostHeader.charCodeAt(0) !== 91/*'['*/) {
        hostHeader = `[${hostHeader}]`;
      }

      if (port && +port !== defaultPort) {
        hostHeader += ':' + port;
      }
      this.setHeader('Host', hostHeader);
    }
  }

  if (options.auth && !this.getHeader('Authorization')) {
    this.setHeader('Authorization', 'Basic ' +
                   Buffer.from(options.auth).toString('base64'));
  }

  if (method === 'GET' ||
      method === 'HEAD' ||
      method === 'DELETE' ||
      method === 'OPTIONS' ||
      method === 'CONNECT') {
    this.useChunkedEncodingByDefault = false;
  } else {
    this.useChunkedEncodingByDefault = true;
  }

  if (headersArray) {
    this._storeHeader(this.method + ' ' + this.path + ' HTTP/1.1\r\n',
                      options.headers);
  } else if (this.getHeader('expect')) {
    if (this._header) {
      throw new errors.Error('ERR_HTTP_HEADERS_SENT', 'render');
    }

    this._storeHeader(this.method + ' ' + this.path + ' HTTP/1.1\r\n',
                      this[outHeadersKey]);
  }

  this._ended = false;
  this.res = null;
  this.aborted = undefined;
  this.timeoutCb = null;
  this.upgradeOrConnect = false;
  this.parser = null;
  this.maxHeadersCount = null;

  var called = false;

  var oncreate = (err, socket) => {
    if (called)
      return;
    called = true;
    if (err) {
      process.nextTick(() => this.emit('error', err));
      return;
    }
    this.onSocket(socket);
    this._deferToConnect(null, null, () => this._flush());
  };

  if (this.agent) {
    // If there is an agent we should default to Connection:keep-alive,
    // but only if the Agent will actually reuse the connection!
    // If it's not a keepAlive agent, and the maxSockets==Infinity, then
    // there's never a case where this socket will actually be reused
    if (!this.agent.keepAlive && !Number.isFinite(this.agent.maxSockets)) {
      this._last = true;
      this.shouldKeepAlive = false;
    } else {
      this._last = false;
      this.shouldKeepAlive = true;
    }
    this.agent.addRequest(this, options);
  } else {
    // No agent, default to Connection:close.
    this._last = true;
    this.shouldKeepAlive = false;
    if (typeof options.createConnection === 'function') {
      const newSocket = options.createConnection(options, oncreate);
      if (newSocket && !called) {
        called = true;
        this.onSocket(newSocket);
      } else {
        return;
      }
    } else {
      debug('CLIENT use net.createConnection', options);
      this.onSocket(net.createConnection(options));
    }
  }

  this._deferToConnect(null, null, () => this._flush());
}
```




#### [get(options, cb)](https://github.com/nodejs/node/blob/master/lib/http.js#L41)


```

function get(options, cb) {
  var req = request(options, cb);
  req.end();
  return req;
}
```


基本的にrequestと同じ。requestに対して引数をそのまま渡し、req.end()を呼んだ後にreqを返す。





---------------------


### requireしているファイル

####  [_http_agent.js](https://github.com/nodejs/node/blob/master/lib/_http_agent.js)

Agentクラスを管理しているファイル。Agentはmodule.exportsされてる(https://github.com/nodejs/node/blob/master/lib/http.js#L51 )

docsだと[Class:http.Agent](https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_class_http_agent)あたり


```
const net = require('net');
const util = require('util');
const EventEmitter = require('events');
const { async_id_symbol } = process.binding('async_wrap');
const { nextTick } = require('internal/process/next_tick');
```


- { ClientRequest }
-> [_http_client.js](https://github.com/nodejs/node/blob/master/lib/_http_client.js#L80)

- common
-> [_http_common.js](https://github.com/nodejs/node/blob/master/lib/_http_common.js)

- incoming
-> [_http_incoming.js](https://github.com/nodejs/node/blob/master/lib/_http_incoming.js)

- outgoing
-> [_http_outgoing.js](https://github.com/nodejs/node/blob/master/lib/_http_outgoing.js)

- {server}
-> [_http_server.js](https://github.com/nodejs/node/blob/master/lib/_http_server.js#L263)
