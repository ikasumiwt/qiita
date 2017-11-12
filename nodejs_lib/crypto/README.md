# notes
https://nodejs.org/api/crypto.html の読み物です。

## Node.js v8.9.1 Documentation

[docs](https://nodejs.org/dist/latest-v8.x/docs/api/crypto.html)

### Crypto
`Stability: 2 - Stable`


cryptoモジュールは、OpenSSLのハッシュ、HMAC、暗号、解読、署名、検証機能用の関数のラッパーなどのセットを含む暗号関連の機能を提供します。

require('crypto')することによって、cryptoモジュールにアクセスすることができます。


```
// `crypto_sample.js`
const crypto = require('crypto');

const secret = 'abcdefg';
const hash = crypto.createHmac('sha256', secret)
                   .update('I love cupcakes')
                   .digest('hex');
console.log(hash);
// 手元で実行時
// c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e
```

#### cryptoのサポートが利用できるか判断する
cryptoモジュールのサポートを含まずにNode.jsを構築することは可能です。
その場合、require('crypto')するとエラーがスローされます。

```
// あとで確認する
// no_crypto.js
let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}
```



### Class: Certificate

SPKAC(Signed Public Key And Challenge)は、元々はNetscapeによって実装された証明書の署名を要求するためのメカニズムです。現在はHTML5のkeygenの要素として指定されています。

cryptoモジュールはSPKACデータを動かすためのCertificateクラスを提供します。

もっとも一般的な使い方は、HTML5(keygen)要素によって生成されたアウトプットをハンドリングすることです。

Node.jsはOpenSSLのSPKACの実装を中では利用しています。

この辺
- https://github.com/nodejs/node/blob/master/lib/internal/crypto/certificate.js#L7
- https://github.com/nodejs/node/blob/829d8f1cd0351d9fc3ee0ff9ce63c6f6c34da373/src/node_crypto.cc#L5955


本体の実装はここ？
-  https://github.com/nodejs/node/blob/fb56046cf0405bfca4b88746b5372d3769275e6a/deps/openssl/openssl/apps/spkac.c


- keygen(HTML5) https://developer.mozilla.org/ja/docs/Web/HTML/Element/keygen


サンプル(chromeは[1] Web Crypto API を採用したため Chrome 49 で非推奨化、Chrome 57 で削除しましたらしいのでSafariで確認)

```
// keygen.html

~/crypto/samples/keygen.html?name=aaa&security=MIICQTCCASkwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDW%2Fupa%2BpKD2u5is4BBRob%2BnkxQ5VlCqvcGvXSIRfwEYua5E031MxJdkdZht%2Fm8fDTrksdsdiBcVk3m6CKbmuw5uvTDF7PuM%2Fu82beRHz2FHfJjYQ9SBEuGAP%2FWvvBGwkGh3%2BL2Ho%2BiuunD%2FyBHitzRKHQoEnc7oh8fcyBd3yoG15c2LrB8TDmoYfxhWLVr71msuKmaxbZ5xOd5lwiF6NIflZp19WAOuibqi6Ak%2FsFB95oC23flQ%2FTSPnvcTrUa8FDor%2BVZ8NsGZ%2BoIn%2FKVBb1G6JNq7OOGpoQReZwHNtDemyRbEURmvnsyGjzFjIUbMnH8AhgMH2hgpKh%2F8dSbLlpjAgMBAAEWAQAwDQYJKoZIhvcNAQEEBQADggEBAAtf4qrmCtzfjwkVyF3eziBESlI3A3mPdhe9Lp1zc88qXJi%2BU8Riz%2Bq4XV%2BYF93eyrY5ThMFCllI98gv2lJ5GciOgl4WDXpewlod6sLZKIXXOipT5nYZrrqcOI3fedPukETubrnwlRgtFRFcCYpPWbKyD7I8kRzPzdCDNX8ClNtFx22rDyVDOe4MlxiPi2pq2gyJtc2iIcZIk4LakNaXrz9LkMUmLqGsSFcdvaktXdYtGq%2FG6nFUsV%2FnI%2Fu%2BzMD7653O6uXwgRUX2qmkJUsMG16KdWtWoQ22nDTUImd98yzTqvfsJNXYKdCgIvJrAqaeOr7%2FwKb886eA3cQzu76Tg0Y%3D
```

- Web Crypto api
https://developer.mozilla.org/ja/docs/Web/API/Web_Crypto_API


#### new crypto.Certificate()

Certificateクラスのインスタンスはnewで宣言するか、crypto.Certificate()関数を呼び出すことによって生成することが出来ます。

- crypto.Certificate()
https://github.com/nodejs/node/blob/master/lib/internal/crypto/certificate.js#L44


```
// new_certificate.js
const crypto = require('crypto');

const cert1 = new crypto.Certificate();
const cert2 = crypto.Certificate();
```

#### certificate.exportChallenge(spkac)

- spkac <string> | <Buffer> | <TypedArray> | <DataView>

- Returns <Buffer>  公開鍵とChallengeを含む、spkacデータ構造のチャレンジコンポーネント

// The challenge component of the spkac data structure, which includes a public key and a challenge.



```
// exportChallenge.js
const cert = require('crypto').Certificate();
const spkac = getSpkacSomehow();
const challenge = cert.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Prints: the challenge as a UTF8 string
```


#### certificate.exportPublicKey(spkac)

- spkac <string> | <Buffer> | <TypedArray> | <DataView>

- Returns <Buffer>  公開鍵とChallengeを含む、spkacデータ構造の公開鍵コンポーネント



```
const cert = require('crypto').Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// Prints: the public key as <Buffer ...>
```


#### certificate.verifySpkac(spkac)

- spkac <Buffer> | <TypedArray> | <DataView>
- Returns <boolean> spkacのデータ構造が有効な状態の場合trueが、それ以外の場合はfalseが返ります

```
const cert = require('crypto').Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// Prints: true or false
```


### Class: Cipher


Cipherクラスのインスタンスは、データを暗号化する際に利用します。
このクラスは次の２つの方法で利用できます。

・読み/書き可能なストリームとして暗号化する
リーダブル側にプレーンな暗号化されていないデータをおき、暗号化されたデータを書き出す

// 怪しい
As a stream that is both readable and writable
,where plain unencrypted data is written to produce
encrypted data on the readable side,

もしくは
cipher.update(),cipher.final()関数を利用して、暗号化されたデータを生成する。

crypto.createCipher()もしくはcrypto.createCipheriv()関数はCipherのインスタンスを作成するのに使われます。
Cihperオブジェクトはnewをもちいて作成することはできません

Example: Using Cipher objects as streams:

```
// stream_cipher.js
const crypto = require('crypto');
const cipher = crypto.createCipher('aes192', 'a password');

let encrypted = '';
cipher.on('readable', () => {
  const data = cipher.read();
  if (data)
    encrypted += data.toString('hex');
});
cipher.on('end', () => {
  console.log(encrypted);
  // Prints: ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504
});

cipher.write('some clear text data');
cipher.end();
```

Example: Using Cipher and piped streams:

```
// pipe_cipher.js
const crypto = require('crypto');
const fs = require('fs');
const cipher = crypto.createCipher('aes192', 'a password');

const input = fs.createReadStream('test.js');
const output = fs.createWriteStream('test.enc');

input.pipe(cipher).pipe(output);
```

Example: Using the cipher.update() and cipher.final() methods:


```
// update_and_final.js
const crypto = require('crypto');
const cipher = crypto.createCipher('aes192', 'a password');

let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
encrypted += cipher.final('hex');
console.log(encrypted);
// Prints: ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504
```


#### cipher.final([outputEncoding])

#### cipher.setAAD(buffer)

#### cipher.getAuthTag()

#### cipher.setAutoPadding([autoPadding])

#### cipher.update(data[, inputEncoding][, outputEncoding])

### Class: Decipher
Instances of the Decipher class are used to decrypt data. The class can be used in one of two ways:

As a stream that is both readable and writable, where plain encrypted data is written to produce unencrypted data on the readable side, or
Using the decipher.update() and decipher.final() methods to produce the unencrypted data.
The crypto.createDecipher() or crypto.createDecipheriv() methods are used to create Decipher instances. Decipher objects are not to be created directly using the new keyword.

Example: Using Decipher objects as streams:

```
const crypto = require('crypto');
const decipher = crypto.createDecipher('aes192', 'a password');

let decrypted = '';
decipher.on('readable', () => {
  const data = decipher.read();
  if (data)
    decrypted += data.toString('utf8');
});
decipher.on('end', () => {
  console.log(decrypted);
  // Prints: some clear text data
});

const encrypted =
    'ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504';
decipher.write(encrypted, 'hex');
decipher.end();

```

Example: Using Decipher and piped streams:
```
const crypto = require('crypto');
const fs = require('fs');
const decipher = crypto.createDecipher('aes192', 'a password');

const input = fs.createReadStream('test.enc');
const output = fs.createWriteStream('test.js');

input.pipe(decipher).pipe(output);
```


Example: Using the decipher.update() and decipher.final() methods:
```
const crypto = require('crypto');
const decipher = crypto.createDecipher('aes192', 'a password');

const encrypted =
    'ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// Prints: some clear text data
```


#### decipher.final([outputEncoding])

#### decipher.setAAD(buffer)

#### decipher.setAuthTag(buffer)

#### decipher.setAutoPadding([autoPadding])

#### decipher.update(data[, inputEncoding][, outputEncoding])

### Class: DiffieHellman
The DiffieHellman class is a utility for creating Diffie-Hellman key exchanges.

Instances of the DiffieHellman class can be created using the crypto.createDiffieHellman() function.

```
const crypto = require('crypto');
const assert = require('assert');

// Generate Alice's keys...
const alice = crypto.createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Generate Bob's keys...
const bob = crypto.createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
```

#### diffieHellman.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])


#### diffieHellman.generateKeys([encoding])


#### diffieHellman.getGenerator([encoding])

#### diffieHellman.getPrime([encoding])


#### diffieHellman.getPrivateKey([encoding])

#### diffieHellman.getPublicKey([encoding])


#### diffieHellman.setPrivateKey(privateKey[, encoding])#



#### diffieHellman.setPublicKey(publicKey[, encoding])


#### diffieHellman.verifyError

### Class: ECDH
The ECDH class is a utility for creating Elliptic Curve Diffie-Hellman (ECDH) key exchanges.

Instances of the ECDH class can be created using the crypto.createECDH() function.

```
const crypto = require('crypto');
const assert = require('assert');

// Generate Alice's keys...
const alice = crypto.createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// Generate Bob's keys...
const bob = crypto.createECDH('secp521r1');
const bobKey = bob.generateKeys();

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// OK
```

#### ecdh.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])

#### ecdh.generateKeys([encoding[, format]])


#### ecdh.getPrivateKey([encoding])

#### ecdh.getPublicKey([encoding][, format])

#### ecdh.setPrivateKey(privateKey[, encoding])

#### ecdh.setPublicKey(publicKey[, encoding])

### Class: Hash
The Hash class is a utility for creating hash digests of data. It can be used in one of two ways:

As a stream that is both readable and writable, where data is written to produce a computed hash digest on the readable side, or
Using the hash.update() and hash.digest() methods to produce the computed hash.
The crypto.createHash() method is used to create Hash instances. Hash objects are not to be created directly using the new keyword.

Example: Using Hash objects as streams:

```
const crypto = require('crypto');
const hash = crypto.createHash('sha256');

hash.on('readable', () => {
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
```

Example: Using Hash and piped streams:

```
const crypto = require('crypto');
const fs = require('fs');
const hash = crypto.createHash('sha256');

const input = fs.createReadStream('test.js');
input.pipe(hash).pipe(process.stdout);
```

Example: Using the hash.update() and hash.digest() methods:

```
const crypto = require('crypto');
const hash = crypto.createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// Prints:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```
#### hash.digest([encoding])

#### hash.update(data[, inputEncoding])

### Class: Hmac

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
