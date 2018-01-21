'use strict'

const http = require('http')

let opt = {
  host: 'www.yahoo.co.jp',
  headers: {'Cookie': 'hogehoge'}
}

const req = http.request(opt, (res) => {

  // ここのcallbackと responseイベントは同義 : https://github.com/nodejs/node/blob/master/lib/_http_client.js#L132
  // console.log(res.headers)
  // console.log(res)
})

req.end()

req.once('response', (res) => {
  // 引数はIncomingMessageインスタンス
  // ここでレスポンスが取得できる
  console.log(res.headers)
  // IncomingMessageはClientResponseなのでstatusCodeが生えている
  console.log(res.statusCode)
  
  // dataイベントを追加できる
  res.on('data', (chunk) => {
    console.log('' + chunk)
  });
  // endも
  res.on('end', () => {
    console.log('response end.')
  });

  // if a 'response' event handler is added, then the data from the response object must be consumed, 
  // エラー時など？
  // res.resume()
})


process.on('uncaughtException', function (err) {
  console.log(err);
}); 


