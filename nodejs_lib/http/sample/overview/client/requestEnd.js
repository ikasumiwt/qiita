'use strict'

const http = require('http')

const opt = {
  host: 'localhost',
  port: 8888,
  method: 'POST'
}

const req = http.request(opt, (req) => {
  // console.log(req)
  console.log('request callback')
})



req.write('write test')

req.end('end')



/*
req.end単体の場合
-> Content-Lengthが付与される
--
POST / HTTP/1.1
Host: localhost:8888
Connection: close
Content-Length: 3

end
-------

req.write()後のreq.end()の場合
-> Transfer-Encoding: chunkedが付与される

POST / HTTP/1.1
Host: localhost:8888
Connection: close
Transfer-Encoding: chunked

a
write test
3
end
0

------

write時にヘッダが付与されていない場合、以下の箇所でTransfer-Encoding: chunkedが付与される
->https://github.com/nodejs/node/blob/v8.x/lib/_http_outgoing.js#L408

_stooreHeaderは_implicitHeaderの以下の箇所で呼ばれている
https://github.com/nodejs/node/blob/v8.x/lib/_http_outgoing.js#L631

// implictHeader
// this._storeHeader(this.method + ' ' + this.path + ' HTTP/1.1\r\n', this[outHeadersKey]);

https://github.com/nodejs/node/blob/v8.x/lib/_http_client.js#L294


---
end()時:https://github.com/nodejs/node/blob/v8.x/lib/_http_outgoing.js#L723

(今回の1例のように)事前にwrite()している場合（headerが存在している場合）はそのまま_writeされる(Transfer-Encoding: chunkedが付与済みで、それが利用される)
そうでなく、headerが存在していない場合はここで_contentLengthを取得してからwrite_している。 (_contentLengthに数値が入るため、　https://github.com/nodejs/node/blob/v8.x/lib/_http_outgoing.js#L403　でContent-Lengthが付与される)


*/
