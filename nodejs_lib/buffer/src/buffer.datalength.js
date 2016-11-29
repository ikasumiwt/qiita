'use strict';

// 0xNNDD~DD
// NN:データの長さ
// DD: データ本体　みたいなデータを考える？

var data = [
            0x04, //データの長さ
            0x00,
            0xff,
            0xaa,
            0xbb,
            ];
var buf = Buffer.from(data);

//データの長さを取得
var len = buf.readUInt8(0);

console.log( 'len:' + len );
for( var i = 1; i <= len; i++ ){

    console.log( 'data ' + i + ':' + buf.readUInt8(i) );
};




