# notes
https://github.com/nodejs/node/blob/v6.9.1-proposal/lib/fs.js
の読み物です。

## Node.js v6.9.1 Documentation

[docs](https://nodejs.org/dist/latest-v6.x/docs/api/fs.html)

### File System

File I/Oは標準のPOSIX関数を元にしたシンプルなラッパーによって提供されています。
このモジュールを使うためにはrequire('fs')を使用します。
すべての関数は、同期/非同期の形式両方をもっています。

非同期形式の関数は常にコールバック関数を最後の引数としてもっています。
完了コールバック(?)に渡す引数はその関数に依存しますが、最初の引数は常に例外用に予約されています。
もし操作が完了した場合、最初の引数はnull or undefinedが帰ってきます。

同期形式を使うと、すぐに例外が投げられます。try-catchを用いることで、例外を処理することができます。

以下が非同期的な場合のコードです。

```
const fs = require('fs');

fs.unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```

以下が同期的な場合です。

```
const fs = require('fs');

fs.unlinkSync('/tmp/hello');
console.log('successfully deleted /tmp/hello');
```

非同期メソッドを使う場合、順序は保証されません。その為、以下のようなエラーが起こりやすくなります。

```
fs.rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  console.log('renamed complete');
});
fs.stat('/tmp/world', (err, stats) => {
  if (err) throw err;
  console.log(`stats: ${JSON.stringify(stats)}`);
});
```

この場合、fs.statがfs.renameより前に動作する恐れがあります。
正しく行う方法は、コールバックチェーンすることです。



```
fs.rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  fs.stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
```

ビジーなプロセスでは、非同期的な関数を使用することを強く推奨します。
同期的なバージョンは完了するまでプロセス全体をブロックし、完了するまですべての接続を停止します。

ファイルネームへの相対パスも使用することができます。
しかし、このパスはprocess.cwd()に対しての相対パスであることを覚えておいてください。


殆どのfsの関数では、コールバックの引数を省略することができます。
これを行った場合、エラーを戻すデフォルトのコールバックが使用されます。(※1)

オリジナルのコールサイト(?)のトレースを取得する方法は、NODE_DEBUGの環境変数を設定します。

```
$ cat script.js
function bad() {
  require('fs').readFile('/');
}
bad();

$ env NODE_DEBUG=fs node script.js
fs.js:88
        throw backtrace;
        ^
Error: EISDIR: illegal operation on a directory, read
    <stack trace.>
```


### Buffer API
Added in: v6.0.0

fs関数は文字列とバッファともに受け渡しできるようにサポートしています。
後者(バッファ)はUTF8ではないファイル名を許しているファイルシステムで動くことを可能にすることを意図しています。

最も一般的な用途としては、文字列APIがUTF8に自動的に変kんされるため、バッファとして動作するのは特に必要ありません。


Note:
特定のファイルシステム(NTFS/HFS+など)では、ファイル名は常にUTF8にエンコードされることに注意してください。

このようなファイルシステムでは、非UTF8でエンコードされたバッファをfs関数に渡しても期待通りに動かない可能性があります。


### Class: fs.FSWatcher
fs.watch()から返されるオブジェクトはこの型です。

fs.watch()に提供されるリスナーコールバックは
FSWatcherの変更イベントによって返された値を受け取ります。


オブジェクト自体は次のイベントを発生させます。

#### Event: 'change'

* eventType : String
* filename : String| Buffer

ウォッチしているディレクトリかファイルが変更された時に送信されます。
OSのサポートによってはfilename引数が提供されない場合があります。
詳細はfs.watch()を見てください。


ファイルネームが提供されている場合、fs.watch()が呼び出されます。
そしてencodingオプションにbufferがセットされている場合、Bufferとして提供され、
そうでない場合、ファイルネームは文字列になります。

```
// Example when handled through fs.watch listener
fs.watch('./tmp', {encoding: 'buffer'}, (eventType, filename) => {
  if (filename)
    console.log(filename);
    // Prints: <Buffer ...>
});
```


#### Event: 'error'

エラーが発生した時に発生するイベントです。

#### watcher.close()

fs.FSWatcherから与えられる変更をウォッチしないようにします。

### Class: fs.ReadStream

Readable Stream形式のクラスです。

#### Event: 'open'

* fd : Integer / Readable Streamで利用される識別子です

ReadStreamが開かれた時に起きます。

#### Event: 'close'

fs.close()メソッドを使用して、ReadStreamの根底にあるファイルディスクリプタが閉じられた時に発生します。

#### readStream.bytesRead

これまでに読み込まれたバイトを返します。

#### readStream.path

fs.createReadStreamの最初の引数で指定されている、streamが読み込んでいるファイルへのパスです。
pathが文字列で渡された場合、readStream.pathは文字列になります。
pathがBufferとして渡された場合には、readStream.pathはBufferになります。

### Class: fs.Stats

fs.stats(),fs.lstat(),fs.fstatsとその同期的な関数が返すのは、この型のオブジェクトです。


* stats.isFile()
* stats.isDirectory()
* stats.isBlockDevice()
* stats.isCharacterDevice()
* stats.isSymbolicLink() (only valid with fs.lstat())
* stats.isFIFO()
* stats.isSocket()

通常の場合、util.inspect(stats)は以下のような文字列を返します。

```
{
  dev: 2114,
  ino: 48064969,
  mode: 33188,
  nlink: 1,
  uid: 85,
  gid: 100,
  rdev: 0,
  size: 527,
  blksize: 4096,
  blocks: 8,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT
}
```

atime, mtime, birthtime, ctimeはDateオブジェクトのインスタンスで、これらのオブジェクトの値を比較するためには、適切なメソッドを利用する必要があります。

よくある使い方の、
getTime()はUTCの1970/01/01から経過したミリ秒を返します。
そしてこの整数は、比較には十分ではありますが、ファジー情報を表示するためにするためにはほかに追加できる方法があります。

詳しくは[MDN JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)を参照ください。


#### Stat Time Values

statオブジェクトのtimesには以下のような意味を持ちます。

* atime : "Access Time"

ファイルデータに最後にアクセスした時間です。
mknod(2), utimes(2), and read(2) のシステムコールによって変更されます。

* mtime : "Modified Time"

ファイルデータが最後に修正された時間です。
mknod(2), utimes(2), and read(2) のシステムコールによって変更されます。

* ctime : "Change Time"

ファイルデータが最後に変更された(inodeデータの修正された)時間です。
mknod(2), utimes(2), and read(2) のシステムコールによって変更されます。

* birthtime : "Birth Time"

ファイルの作成時間です。ファイルが作成される時に一度だけセットされます。
birthtimeが存在しないファイルシステムでは、このフィールドはctimeか1970-01-01T00:00Z(unix timestampの0)が保存される可能性があります。
この値は、atimeやmtimeより大きい場合があります。

DarwinやFreeBSDの亜種では、同じようにatimeがutimes(2)のシステムコールを使って現在のbirthtimeよりも前の値に設定されている場合にも設定されます。


Node v0.12以前では、ctimeはWindowsシステム上ではbirthtimeを保持していました、
v0.12のときには、ctimeはunix上ではcreation timeではなかったことに注意してください、


### Class: fs.WriteStream

WriteStreamはWritable Streamです。

#### Event: open

* fd : Integer / WriteStreamに利用するファイルディスクリプタの整数です。

WriteStreamのファイルをオープンした時に発行されます。

#### Event: close

WriteStreamの根底にあるファイルディスクリプタが、fs.close()メソッドで閉じられた際に発行されます。

#### writeStream.bytesWritten

これまでに書き込まれたバイト数です。書き込むキューにまだ残っているデータは含まれません。

#### writeStream.path

fs.createWriteStreamの最初の引数で指定されている、streamが書き込んでいるファイルへのパスです。

pathが文字列で渡された場合は文字列になりますが、Bufferで渡された場合はwriteStream.pathはBufferになります。

### fs.access(path[, mode], callback)

* path <String> | <Buffer>
* mode <Integer>
* callback <Function>

pathによって指定されたファイル/ディレクトリに対するユーザーのパーミッションをテストします。
引数のmodeは実行されるアクセシビリティのチェックのオプションの整数です。

以下の定数は、modeで指定できることができる値です。

2つ以上の値はビット単位のORをマスクで作ることが可能です。

* fs.constants.F_OK

pathは呼ばれるプロセスから見えます。
これは、ファイルが存在するのかを判断するのには便利だけれど、rwxの権限についてはなにもわかりません。
モードが指定されていない場合のデフォルトの値です。

* fs.constants.R_OK

pathが呼び出し元のプロセスによってreadできるかテストするmodeです

* fs.constants.W_OK

pathが呼び出し元のプロセスによってwriteできるかテストするmodeです

* fs.constants.X_OK

pathが呼び出し元のプロセスから実行できるかをテストするmodeです。
これはWindows上では効果がありません。(fs.constants.F_OKと同じように動作します。)

callbackは最後の引数で、callback関数はエラーをもつ可能性のある引数をもって呼び出されます。
アクセシビリティのチェックのいずれかが失敗すると、エラーの引数が設定されます。

以下の例では、/etc/passwdファイルを現在のプロセスで読み書きできるかどうかをチェックします。


```
fs.access('/etc/passwd', fs.constants.R_OK | fs.constants.W_OK, (err) => {
  console.log(err ? 'no access!' : 'can read/write');
});
```

fs.open()/fs.readFile()/fs.writeFile()を呼び出す前に、ファイルのアクセシビリティをチェックするためにfs.access()を使うことはあまり推奨されません。

他のプロセスで、２つの呼び出しの間でファイルの状態を変更する可能性があり、競合した状態になる可能性があるからです。

代わりに、ユーザーのコードはファイルを直接開いたり/読み出したり/書き込んだりした際に発生したエラーを処理するべきです。

たとえば：

write(非推奨)
```
fs.access('myfile', (err) => {
  if (!err) {
    console.error('myfile already exists');
    return;
  }

  fs.open('myfile', 'wx', (err, fd) => {
    if (err) throw err;
    writeMyData(fd);
  });
});
```

write(推奨)
```
fs.open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === "EEXIST") {
      console.error('myfile already exists');
      return;
    } else {
      throw err;
    }
  }

  writeMyData(fd);
});
```

read(非推奨)
```
fs.access('myfile', (err) => {
  if (err) {
    if (err.code === "ENOENT") {
      console.error('myfile does not exist');
      return;
    } else {
      throw err;
    }
  }

  fs.open('myfile', 'r', (err, fd) => {
    if (err) throw err;
    readMyData(fd);
  });
});
```

read(推奨)
```
fs.open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === "ENOENT") {
      console.error('myfile does not exist');
      return;
    } else {
      throw err;
    }
  }

  readMyData(fd);
});
```

上記の非推奨の例では、アクセシビリティをチェックしてからファイルを使用します。
推奨された例では、ファイルを直接利用し、エラーをハンドリングしているため、推奨されています。



一般的に、ファイルが直接使用されない場合だけファイルのアクセシビリティをチェックします。
例えば、そのアクセシビリティが他のプロセスからシグナルがある場合などです。

### fs.accessSync(path[, mode])

* path <String> | <Buffer>
* mode <Integer>

fs.access()の同期的なバージョンです。
アクセシビリティのチェックが失敗した場合はthrowされて、それ以外の場合はなにもしないです。


### fs.appendFile(file, data[, options], callback)


* file <String> | <Buffer> | <Number> filename or file descriptor
* data <String> | <Buffer>
* options <Object> | <String>
  * encoding <String> | <Null> default = 'utf8'
  * mode <Integer> default = 0o666
  * flag <String> default = 'a'
* callback


非同期的にファイルにデータを追加します。

ファイルが存在しない場合はファイルを作ります。

データはstringかbufferです。

例：

```
fs.appendFile('message.txt', 'data to append', (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
```


optionsはstringの場合、エンコーディングを指定します。
```
fs.appendFile('message.txt', 'data to append', 'utf8', callback);
```

指定されたファイルディスクリプタが追加のために開かれていなければいけません。


### fs.appendFileSync(file, data[, options])

fs.appendFile()の同期バージョンです。


### fs.chmod(path, mode, callback)

* path <String> | <Buffer>
* mode <Integer>
* callback <Function>

chmod(2)を非同期で行います。
可能性のある例外以外の引数(?)はcallbackには渡されません。

### fs.chmodSync(path, mode)

fs.chmod()の同期バージョンです。

### fs.chown(path, uid, gid, callback)

* path <String> | <Buffer>
* uid <Integer>
* gid <Integer>
* callback <Function>

chown(2)の非同期版です。
これも可能性のある例外以外の引数はcallbackには渡されません。

### fs.chownSync(path, uid, gid)

chown(2)の同期バージョンです。

### fs.close(fd, callback)

* fd <Integer>
* callback <Function>

close(2)を非同期でやります。
これも可能性のある例外以外の引数はcallbackには渡されません。

### fs.closeSync(fd)

fs.close()の同期バージョンです。

### fs.constants

ファイルシステムの操作でよく使う定数が含まれているオブジェクトを返します。

現在定義されている定数に関しては[FS constants](https://nodejs.org/dist/latest-v6.x/docs/api/fs.html#fs_fs_constants_1)を参照ください。




### fs.createReadStream(path[, options])

* path <String> | <Buffer>
* options <String> | <Object>
 * flags <String>
 * encoding <String>
 * fd <Integer>
 * mode <Integer>
 * autoClose <Boolean>
 * start <Integer>
 * end <Integer>



ReadStreamオブジェクトを返します。詳しくは:[Readable Stream](https://nodejs.org/dist/latest-v6.x/docs/api/stream.html#stream_class_stream_readable)

Stream APIで作られるReadableStreamでは、highWaterMarkのデフォルトの値が16kbですが、この関数から返されるストリームのhighWaterMarkは64kbがデフォルトになっていることに注意してください。

optionsは、以下のデフォルトの値を持つオブジェクトかStringです。

```
{
  flags: 'r',
  encoding: null,
  fd: null,
  mode: 0o666,
  autoClose: true
}
```

optionsには、ファイル全体ではなく、ファイルの読み込む範囲の開始と終了の(start/endの)値を含めることが出来ます。
start/endの両方が含まれ、そして0からカウントを開始します。
もしfdが指定され、startが省略かundefinedだった場合、fs.createReadStreamは現在のファイルの位置から順番に読み込みます。
encodingはBufferで受け入れることのできるいずれかの値を１つだけ指定できます。

fdを指定した場合、ReadStreamは引数のpathを無視して、指定されたファイルディスクリプタを使用します。
これは、'open'イベントが発火されないという意味です。

note:fdはブロックされているべきです。
ノンブロッキングなfdはnet.Socketを渡すべきです。

autoCloseがfalseな場合、エラーがあったとしてもファイルディスクリプタはクローズされません。
その場合、ファイルディスクリプタがリークしていないかを確認するのはあなたの責任になります。

もし、autoCloseがtrueの場合(デフォルトの場合)、on errorやendになると自動的にファイルディスクリプタは閉じられます。
modeは、ファイルモード（パーミッションとスティッキービット）を設定しますg、これはファイルが作成された場合に限ります。

以下は、100バイトのファイルの最後の10バイトだけを読み込む場合のサンプルです。

```
fs.createReadStream('sample.txt', {start: 90, end: 99});
```

optionsが文字列で渡された場合はエンコーディングを指定します。


### fs.createWriteStream(path[, options])

* path <String> | <Buffer>
* options <String> | <Object>
 * flags <String>
 * defaultEncoding <String>
 * fd <Integer>
 * mode <Integer>
 * autoClose <Boolean>
 * start <Integer>



WriteStreamを返します。詳しくは：[Writable Stream](https://nodejs.org/dist/latest-v6.x/docs/api/stream.html#stream_class_stream_writable)

optionsは、以下のデフォルトの値を持つオブジェクトか、Stringです。

```
{
  flags: 'w',
  defaultEncoding: 'utf8',
  fd: null,
  mode: 0o666,
  autoClose: true
}
```

optionsにはstartオプションが含まれています。
ファイルの開始位置からいくつか前からデータを書き込む許可も含まれています。
ファイルを置き換えるのではなく、変更する場合、デフォルトのw flagsではなく、r+のflagsが必要な場合があります。
defaultEncodingオプションはBufferによって受け入れることのできるエンコーディングであればなんでも大丈夫です。

autoCloseがtrue(デフォルト)の場合、on errorやendはファイルディスクリプタが閉じられた時に自動で発火します。
falseの場合、エラーがあっても自動でファイルディスクリプタは閉じられません。これを閉じ、ファイルディスクリプタがリークしないようにチェックするのはあなたの責任になります。

ReadStreamのように、fdを指定するとWriteStreamは引数のpathを無視して、指定されたファイルディスクリプタを利用します。
これは、'open'イベントが発火されないという意味です。

note:fdはブロックされているべきです。
ノンブロッキングなfdはnet.Socketを渡すべきです。


optionsがstringの場合、それはencodingを指定します。


### fs.exists(path, callback)
v1.0.0からDeprecated

fs.stat()かfs.accessを利用しましょう。

* path <String> | <Buffer>
* callback <Function>

与えられたpathが存在するかどうかをチェックします。
その後、callbackにtrue/falseを渡します。

例：
```
fs.exists('/etc/passwd', (exists) => {
  console.log(exists ? 'it\'s there' : 'no passwd!');
});
```

このコールバックのパラメータは、他のNode.jsコールバックと一貫性がないことに注意してください。

普通、Node,jsのコールバックの第一引数はerrパラメータが返され、それに続いて他のパラメータが返却されます。
このfs.exists()のコールバックは、たったひとつのbooleanのパラメータしか返しません。
それが、fs.exists()が非推奨で、fs.accessが推奨される理由の１つです。

~非推奨なので略~

### fs.existsSync(path)

* path <String> | <Buffer>

fs.exists()の同期バージョンです。trueまたはfalseのどちらかを返します。

注意：fs.exists()は非推奨ですが、こちらは非推奨ではありません。
fs.existsのコールバックパラメータは（上述の通り）他のパラメータと矛盾しますが、fs.existsSyncはコールバックを使わないためです。


### fs.fchmod(fd, mode, callback)

* fd <Integer>
* mode <Integer>
* callback <Function>

fchmodの非同期バージョンです。
callbackには例外以外の引数は与えられません。

### fs.fchmodSync(fd, mode)

* fd <Integer>
* mode <Integer>

fchmodの同期バージョンです。undefinedを返します。


### fs.fchown(fd, uid, gid, callback)

* fd <Integer>
* uid <Integer>
* gid <Integer>
* callback <Function>
fchownの非同期バージョンです。
callbackには例外以外の引数は与えられません。

### fs.fchownSync(fd, uid, gid)

* fd <Integer>
* uid <Integer>
* gid <Integer>

fchownの同期バージョンです。undefinedが返されます。

### fs.fdatasync(fd, callback)

* fd <Integer>
* callback <Function>
fdatasyncの非同期版です。
callbackには例外以外の引数は与えられません。


### fs.fdatasyncSync(fd)

* fd <Integer>

fdatasyncの同期バージョンです。undefinedが返されます。


### fs.fstat(fd, callback)

* fd <Integer>
* callback <Function>

 fstat(2)の非同期バージョンです。
 callbackはerr,statsの２つの引数を持ち、statsはfs.Statsオブジェクトです。
 fstat()はstats()と同じですが、ファイルディスクリプタのfdによって統計的に処理されたファイルです。


### fs.fstatSync(fd)

fchownの同期バージョンです。fs.fStatsのインスタンスが返されます。

### fs.fsync(fd, callback)

* fd <Integer>
* callback <Function>

fsync(2)の非同期バージョンです。
callbackには例外以外の引数は与えられません。

### fs.fsyncSync(fd)
* fd <Integer>

fsync(2)の同期バージョンです。
undefinedが返されます。

### fs.ftruncate(fd, len, callback)

* fd <Integer>
* len <Integer> default = 0
* callback <Function>

 ftruncate(2)の非同期バージョンです。
 callbackには例外以外の引数は与えられません。

もしファイルディスクリプタによって参照されたファイルがlenで指定されたbyteより大きい場合、最初のlenのbyteだけがファイルに保有されます。

例えば、次のプログラムは最初の4 byteだけを保有します。

```
console.log(fs.readFileSync('temp.txt', 'utf8'));
// Prints: Node.js

// get the file descriptor of the file to be truncated
const fd = fs.openSync('temp.txt', 'r+');

// truncate the file to first four bytes
fs.ftruncate(fd, 4, (err) => {
  assert.ifError(err);
  console.log(fs.readFileSync('temp.txt', 'utf8'));
});
// Prints: Node
```

lenのbyteよりもファイルが短い場合、ファイルは拡張されて、\0のbyteで埋められます。

```
console.log(fs.readFileSync('temp.txt', 'utf-8'));
// Prints: Node.js

// get the file descriptor of the file to be truncated
const fd = fs.openSync('temp.txt', 'r+');

// truncate the file to 10 bytes, whereas the actual size is 7 bytes
fs.ftruncate(fd, 10, (err) => {
  assert.ifError(!err);
  console.log(fs.readFileSync('temp.txt'));
});
// Prints: <Buffer 4e 6f 64 65 2e 6a 73 00 00 00>
// ('Node.js\0\0\0' in UTF8)
```

最後の3byteはオーバートランケーションを補うためのnull byte(\0)です。

// 手元で試したら改行コードが1 byte入ったので結果が違った
```
$ echo "Node.js" > temp2.txt
$ node ftrancate_fill.js
Node.js

<Buffer 4e 6f 64 65 2e 6a 73 0a 00 00>
```


### fs.ftruncateSync(fd, len)

* fd <Integer>
* len <Integer> default = 0

ftrancateの同期バージョンです。undefinedを返します。


### fs.futimes(fd, atime, mtime, callback)

* fd <Integer>
* atime <Integer>
* mtime <Integer>
* callback <Function>

与えられたファイルディスクリプタによって参照されたファイルのタイムスタンプを変更します。

### fs.futimesSync(fd, atime, mtime)

* fd <Integer>
* atime <Integer>
* mtime <Integer>

fs.futimes()の同期バージョンです。undefinedを返します。


### fs.lchmod(path, mode, callback)

* path <String> | <Buffer>
* mode <Integer>
* callback <Function>

lchmod(2)の非同期バージョンです。
callbackには例外以外の引数は与えられません。

Mac OS X でのみ利用できます。

### fs.lchmodSync(path, mode)

* path <String> | <Buffer>
* mode <Integer>

lchmod(2)の同期バージョンです。undefinedを返します。


### fs.lchown(path, uid, gid, callback)

* path <String> | <Buffer>
* uid <Integer>
* gid <Integer>
* callback <Function>

lchown(2)の非同期バージョンです。
callbackには例外以外の引数は与えられません。

### fs.lchownSync(path, uid, gid)

* path <String> | <Buffer>
* uid <Integer>
* gid <Integer>

lchown(2)の同期バージョンです。
undefinedを返します。

### fs.link(existingPath, newPath, callback)

* existingPath <String> | <Buffer>
* newPath <String> | <Buffer>
* callback <Function>

link(2)の非同期バージョンです。
callbackには例外以外の引数は与えられません。

### fs.linkSync(existingPath, newPath)

* existingPath <String> | <Buffer>
* newPath <String> | <Buffer>

link(2)の同期バージョンです。
undefinedを返します。

### fs.lstat(path, callback)

* path <String> | <Buffer>
* callback <Function>

lstat(2)の非同期バージョンです。
callbackには、err,statsの2つの引数が与えられ、statsはfs.Statsオブジェクトです。
lstats()はstat()と同じですが、pathがシンボリックリンクの場合は、そのリンク自身が統計的に処理されていて、その参照先のファイルがされているわけではないことに注意する必要があります。

```
$ ls stat
test.txt
$ cat stat/test.txt
aaaaa
$ node lstat.js
{ dev: 16777220,
  mode: 16877,
  nlink: 3,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 78135007,
  size: 102,
  blocks: 0,
  atime: 2017-04-23T17:17:31.000Z,
  mtime: 2017-04-23T17:17:20.000Z,
  ctime: 2017-04-23T17:17:20.000Z,
  birthtime: 2017-04-23T17:17:12.000Z }
```

```
$ ln -s ./stat/test.txt ./linked.txt

$ node lstat.js
{ dev: 16777220,
  mode: 16877,
  nlink: 3,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 78135007,
  size: 102,
  blocks: 0,
  atime: 2017-04-23T17:20:10.000Z,
  mtime: 2017-04-23T17:19:59.000Z,
  ctime: 2017-04-23T17:19:59.000Z,
  birthtime: 2017-04-23T17:17:12.000Z }
```

### fs.lstatSync(path)

* path <String> | <Buffer>

lstat(2)の同期バージョンです。
fs.Statsを返します。


### fs.mkdir(path[, mode], callback)

* path <String> | <Buffer>
* mode <Integer>
* callback <Function>

mkdir(2)の非同期バージョンです。
callbackには例外以外の引数は与えられません。
modeのデフォルトの値は0o777です。

### fs.mkdirSync(path[, mode])

* path <String> | <Buffer>
* mode <Integer>

mkdir(2)の同期バージョンです。undefinedを返します。


### fs.mkdtemp(prefix[, options], callback)

* prefix <String>
* options <String> | <Object>
 * encoding <String> default = 'utf8'
* callback <Function>



ユニークなテンポラリディレクトリを作成します。

ユニークなテンポラリディレクトリを作るために、6つのランダムな文字を生成し、prefixの後ろに追加します。

生成されたフォルダのパスはstringとしてcallbackの２つ目の引数として渡されます。

引数のoptionsには、encodingを指定する文字列かオブジェクトを指定することが出来ます。

例：
```
fs.mkdtemp('/tmp/foo-', (err, folder) => {
  if (err) throw err;
  console.log(folder);
  // Prints: /tmp/foo-itXde2
});
```

注意:
fs.mkdtemp()関数は6つのランダムに得られた文字列をprefiの文字列に直接追加されます。
例えば、/tmpに指定されている時、/tmpのディレクトリの中に一時ディレクトリを作成する場合は、プラットフォーム独自のpathセパレータ（require('path').sep）を付ける必要があります。

```
// The parent directory for the new temporary directory
const tmpDir = '/tmp';

// This method is *INCORRECT*:
fs.mkdtemp(tmpDir, (err, folder) => {
  if (err) throw err;
  console.log(folder);
  // Will print something similar to `/tmpabc123`.
  // Note that a new temporary directory is created
  // at the file system root rather than *within*
  // the /tmp directory.
});

// This method is *CORRECT*:
const path = require('path');
fs.mkdtemp(tmpDir + path.sep, (err, folder) => {
  if (err) throw err;
  console.log(folder);
  // Will print something similar to `/tmp/abc123`.
  // A new temporary directory is created within
  // the /tmp directory.
});

```



### fs.mkdtempSync(prefix[, options])

* prefix <String>
* options <String> | <Object>
 * encoding <String> default = 'utf8'



fs.mkdtemp()の同期バージョンです。生成されたフォルダのpathを返します。

options引数はエンコードを指定するstringか、encodingプロパティをもったオブジェクトを指定することが出来ます。


### fs.open(path, flags[, mode], callback)

* path <String> | <Buffer>
* flags <String> | <Number>
* mode <Integer>
* callback <Function>



非同期でファイルを開きます。詳細は[open(2)](http://man7.org/linux/man-pages/man2/open.2.html)を見てください。
flagsは
* r (読み込む用にファイルを開く。ファイルが存在しない場合は例外が発生)
* r+ (読み書き用にファイルを開く。ファイルが存在しない場合は例外が発生)
* rs+ (同期で読み書き用にファイルを開く。ローカルのファイルシステムのキャッシュをバイパスするようにOSに指示する)
を指定できます。

これ(rs+)は、潜在的に失効したローカルキャッシュをスキップできるようにするために、NFSがマウントされた上でファイルを開く時に特に役立ちます。
これはI/Oのパフォーマンスにとても大きな影響を与えるため、必要が無い場合はこれをflagに指定しないでください。

* w (書き込み用にファイルを開く。存在しない場合はファイルが作成され、存在する場合は切り捨てられます。)
* wx (wに近いですが、pathが存在していた場合は失敗します。)
* w+ (読み書き用にファイルを開きます。存在しない場合はファイルが作成され、存在する場合は切り捨てられます。)
* wx+ (w+に近いですが、pathが存在していた場合は失敗します。)
* a (追加する用にファイルを開く。ファイルが存在しない場合はファイルを生成する。)
* ax (aに近いですが、pathが存在した場合は失敗します。)
* a+ (読みこむのと追加するようにファイルを開く。ファイルが存在しない場合はファイルを生成する。)
* ax+ (a+に近いですが、pathが存在する場合は失敗します。)

modeはファイルのモード(パーミッションとスティッキービット)を設定しますが、ファイルを生成した際に限ります。デフォルトは0666で、読み書き可能です。

callbackにはerrとfdの2つの引数が与えられます。

flagsには、open(2)で記述されているのと同じ数値を指定することもできます。よく使う定数はfs.constantsに存在します。

Windowsでは、flagsは該当するものに変換されます。
例えば、O_WRONLY は FILE_GENERIC_WRITE、 O_EXCL|O_CREAT は CREATE_NEWまたはCreateFileWによって受け付けられます。

Linuxでは、ファオルガ追加モードで開かれた場合、位置指定の書き込みは動きません。
カーネルは位置の引数を無視し、常にファイルの最後にデータを追加していきます。


注意：fs.open()の動作は、いくつかのflagsによってはプラットフォーム固有の挙動をします。
そのため、OS X と Linux上ではa+ flagは(以下の例を見てください)の状態でディレクトリを開くと、エラーが返ってきます。
逆に、WindowsとFreeBSDでは、ファイルディスクリプタが返されます。

```
// OS X and Linux
fs.open('<directory>', 'a+', (err, fd) => {
  // => [Error: EISDIR: illegal operation on a directory, open <directory>]
});

// Windows and FreeBSD
fs.open('<directory>', 'a+', (err, fd) => {
  // => null, <fd>
});

```


### fs.openSync(path, flags[, mode])

 fs.open()の同期バージョンです。ファイルディスクリプタを表す整数を返します。

### fs.read(fd, buffer, offset, length, position, callback)

* fd <Integer>
* buffer <String> | <Buffer>
* offset <Integer>
* length <Integer>
* position <Integer>
* callback <Function>



fdによって指定されたファイルのデータを読み込みます。

bufferはデータが書き込まれるバッファです。

offsetはbufferのどの位置から書き込むかを指定する値です。

lengthは読み込むbyte吸うを示す整数です。

positionはファイル内のどこから読み込むかを示す整数です。
positionがnullの場合、dataは現在の位置から読み込まれます。

callbackにはerr, bytesRead, bufferの3つの引数が与えられます。


### fs.readdir(path[, options], callback)

* path <String> | <Buffer>
* options <String> | <Object>
 * encoding <String> default = 'utf8'
* callback <Function>



readdir(3)の非同期バージョンです。対象のディレクトリのコンテンツを読み込みます。
callbackにはerr,filesの2つの引数が与えられ、filesは'.' と　'..' を含むファイル名の配列です。

optionsはオプショナルな引数で、これはエンコーディングを指定するstringか、encodingプロパティをもったオブジェクトを指定することによって、filenamesやcallbackに使われるエンコーディングを指定することが出来ます。
encodingにbufferがsetされた場合、filenamesはBufferオブジェクトとして渡されます。

### fs.readdirSync(path[, options])

* path <String> | <Buffer>
* options <String> | <Object>
 * encoding <String> default = 'utf8'



readdir(3)の同期バージョンです。返り値は'.' と　'..' を含むファイル名の配列です。

optionsはオプショナルな引数で、これはエンコーディングを指定するstringか、encodingプロパティをもったオブジェクトを指定することによって、filenamesやcallbackに使われるエンコーディングを指定することが出来ます。
encodingにbufferがsetされた場合、filenamesはBufferオブジェクトとして渡されます。


### fs.readFile(file[, options], callback)

* file <String> | <Buffer> | <Integer> filename or file descriptor
* options <Object> | <String>
 * encoding <String> | <Null> default = null
 * flag <String> default = 'r'
* callback <Function>


非同期でfileに含まれるコンテンツを読み込みます。

例：
```
fs.readFile('/etc/passwd', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

callbackはerr,dataの2つの引数が渡され、dataはfileのコンテンツです。

encodingが指定されていない場合、bufferで返されます。

optionsがstringの場合、encodingが指定されます。

例：
```
fs.readFile('/etc/passwd', 'utf8', callback);
```

指定されたファイルディスクリプタはすべて読み取りをサポートする必要があります。

注意：
ファイルディスクリプタがファイルとして指定されている場合、自動的にcloseされません。


### fs.readFileSync(file[, options])

* file <String> | <Buffer> | <Integer> filename or file descriptor
* options <Object> | <String>
  * encoding <String> | <Null> default = null
  * flag <String> default = 'r'



fs.readFileの同期バージョンです。
fileの中身が返されます。

encodingが指定されている場合は、この関数はstringを返しますが、そうでない場合はBufferで返ります。


### fs.readlink(path[, options], callback)

* path <String> | <Buffer>
* options <String> | <Object>
  * encoding <String> default = 'utf8'
* callback <Function>



readlink(2)の非同期バージョンです。

callbacにkはerr, linkStringの2つの引数が与えられます。

optionsの引数はオプショナルですが、callbackに渡されるlink pathで利用するエンコーディングを指定する文字列か、encodingプロパティをもったオブジェクトを指定することが出来ます。

encodingがbufferにセットされている場合、返されるlink pathはBufferオブジェクトとして返されます。

### fs.readlinkSync(path[, options])


* path <String> | <Buffer>
* options <String> | <Object>
  * encoding <String> default = 'utf8'
* callback <Function>



readlink(2)の同期バージョンです。
シンボリックリンクの文字の値が返されます。

optionsの引数はオプショナルですが、callbackに渡されるlink pathで利用するエンコーディングを指定する文字列か、encodingプロパティをもったオブジェクトを指定することが出来ます。

encodingがbufferにセットされている場合、返されるlink pathはBufferオブジェクトとして返されます。


### fs.readSync(fd, buffer, offset, length, position)

* fd <Integer>
* buffer <String> | <Buffer>
* offset <Integer>
* length <Integer>
* position <Integer>



fs.read()の同期バージョンです。bytesReadの値が返されます。


### fs.realpath(path[, options], callback)

* path <String> | <Buffer>
* options <String> | <Object>
  * encoding <String> default = 'utf8'
* callback <Function>



realpath(3)の非同期バージョンです。
err, resolvedPathの2つの引数がcallbackに与えられます。
process.cwdを使用して、相対パスを解決できます。


UTF8に変換できるpathだけサポートされています。

optionsはオプショナルな引数ですが、callbackに渡されるpathのエンコーディングを指定する文字列かencodingプロパティをもったオブジェクトを指定することが出来ます。encodingにbufferが指定された場合、返されるpathはBufferオブジェクトです。


### fs.realpathSync(path[, options])

* path <String> | <Buffer>
* options <String> | <Object>
  * encoding <String> default = 'utf8'



realpath(3)の同期バージョンです。解決されたpathが返されます。

optionsはオプショナルな引数ですが、callbackに渡されるpathのエンコーディングを指定する文字列かencodingプロパティをもったオブジェクトを指定することが出来ます。encodingにbufferが指定された場合、返されるpathはBufferオブジェクトです。


### fs.rename(oldPath, newPath, callback)

* oldPath <String> | <Buffer>
* newPath <String> | <Buffer>
* callback <Function>


rename(2)の非同期バージョンです。
callbackには例外以外の引数は与えられません。

### fs.renameSync(oldPath, newPath)

* oldPath <String> | <Buffer>
* newPath <String> | <Buffer>


rename(2)の同期バージョンです。
undefinedが返されます。


### fs.rmdir(path, callback)

* path <String> | <Buffer>
* callback <Function>


rmdir(2)の非同期バージョンです。
callbackには例外以外の引数は与えられません。


### fs.rmdirSync(path)

* path <String> | <Buffer>


rmdir(2)の同期バージョンです。
undefinedが返されます。

### fs.stat(path, callback)

* path <String> | <Buffer>
* callback <Function>


stat(2)の非同期バージョンです。
callbackにはerr, statsの2つの引数が渡されstatsはfs.Statsオブジェクトです。

エラーが起きた場合、err.codeは[Common System Errors](https://nodejs.org/dist/latest-v6.x/docs/api/errors.html#errors_common_system_errors)の1つです。


fs.open()、fs.readFile()またはfs.writeFile()の前にfs.stat()を利用してファイルの存在を確認することは推奨されません。
代わりに、usercodeはファイルを直接開いたり、読み書きしたりする時に、ファイルが存在しない場合には発生しtエラーを処理する必要があります。

ファイルを操作することなくファイルが存在することを確認するには、fs.access()を利用することを推奨します。

### fs.statSync(path)

* path <String> | <Buffer>


stat(2)の同期バージョンです。
fs.Statsオブジェクトが返されます。


### fs.symlink(target, path[, type], callback)

* target <String> | <Buffer>
* path <String> | <Buffer>
* type <String>
* callback <Function>


symlink(2)の非同期バージョンです。
callbackには例外以外の引数は与えられません。
type引数はデフォルトはfileですが、Windowsプラットフォーム上でのみdir,file,junctionを指定することが出来ます。（他のプラットフォームでは無視されます）

Windowsでのjunctionポイントは絶対パスである必要があります。

junctionを使用する場合、targetの引数は自動的に絶対パスに正規化されます。

サンプルコードは以下です。

```
fs.symlink('./foo', './new-port');
```

これを実行すると、fooを指し示すnew-portというシンボリックリンクが作成されます。


### fs.symlinkSync(target, path[, type])

* target <String> | <Buffer>
* path <String> | <Buffer>
* type <String>


symlink(2)の同期バージョンです。
undefinedが返されます。

### fs.truncate(path, len, callback)

* path <String> | <Buffer>
* len <Integer> default = 0
* callback <Function>


truncate(2)の非同期バージョンです。
callbackには例外以外の引数は与えられません。

ファイルディスクリプタも最初の引数として与えることが出来ます。
この場合は、fs.ftruncateが呼び出されます。


### fs.truncateSync(path, len)

* path <String> | <Buffer>
* len <Integer> default = 0


truncate(2)の同期バージョンです。
undefinedが返されます。
ファイルディスクリプタも最初の引数として与えることが出来ます。
この場合は、fs.ftruncateSyncが呼び出されます。


### fs.unlink(path, callback)

* path <String> | <Buffer>
* callback <Function>


unlink(2)の非同期バージョンです。
callbackには例外以外の引数は与えられません。

### fs.unlinkSync(path)

* path <String> | <Buffer>


unlink(2)の同期バージョンです。
undefinedが返されます。

### fs.unwatchFile(filename[, listener])

* filename <String> | <Buffer>
* listener <Function>


filenameに指定されたファイルの変更の監視をやめます。
listenerが指定されている場合、そのlinstenerのみが削除されます。
それ以外の場合、すべてのリスナーが削除され、filenameに対する冠水がすべて停止します。

監視されていないfs.unwatchFile()を呼び出すと、エラーは起きず、操作されません。

注意：fs.watch()はfs.watchFile()、fs.unwatchFile()よりも効率的です。
fs.watchfs.watchFile()、fs.unwatchFile()よりも、可能であれば、fs.watch()を使ってください。

### fs.utimes(path, atime, mtime, callback)

* path <String> | <Buffer>
* atime <Integer>
* mtime <Integer>
* callback <Function>


与えられたpathによって参照されるファイルのファイルタイムスタンプを変更します。

注意：atime,mtimeは以下の関連する関数のルールに従います。

* 値は秒単位のUnix timestampでないといけません。例えば、Date.nowはミリ秒を返すので、1000で割る必要があります。
* 値が'123456789'のような数値文字列の場合、値は数値に変換されます。
* NaNやInfinityの場合、Date.now()/1000に変換されます。


### fs.utimesSync(path, atime, mtime)

* path <String> | <Buffer>
* atime <Integer>
* mtime <Integer>


fs.utimes()の同期バージョンです。undefinedが返されます。

### fs.watch(filename[, options][, listener])

* filename <String> | <Buffer>
* options <String> | <Object>
  * persistent <Boolean> ファイルが監視されている間、プロセスを継続して実行しておくかどうかを表します。 default = true
  * recursive <Boolean> 再帰的にすべてのサブディレクトリを監視するか、今のディレクトリのみを監視するかを示します。ディレクトリが指定されている場合、サポートされているプラットフォームでのみ動きます。詳細はCaveatsを見てください default = false
  * encoding <String> リスナに渡されるファイル名に利用するエンコーディングを指定します。 default = 'utf8'
* listener <Function>


filenameで指定されたファイルまたはディレクトリの変更を監視します。返されるオブジェクトはfs.FSWatcherです。

第二引数はオプショナルです。optionsがstringの場合はエンコーディングを指定しています。
それ以外の場合はobjectとして渡すべきです。

listenerのコールバックはeventType,filenameの2つの引数を与えられます。eventTypeはrenameまたはchangeのどちらかで、filenameはそのイベントを発火させたファイルの名前です。


ほとんどのプラットフォームでは、ファイル名がディレクトリに表示されたり消えたりするたびに、名前の変更が行われます


同じように、リスナーコールバックはfs.FSWatcherによって発火された'change'イベントに関連付けられていますが、eventTypeの 'change'の値と同じではありません。

#### 警告
// Caveats

fs.watch APIはすべてのプラットフォームでい使えるわけではなく、いくつかのシチュエーションでは使えません。

(例えば)recursiveオプションはOS XとWindowsでしかサポートされていません。

##### 可用性
// Availability

以下の機能は、基本となるOSに依存してファイルシステムの変更を通知する方法を提供しています。

* On Linux systems, this uses inotify
* On BSD systems, this uses kqueue
* On OS X, this uses kqueue for files and FSEvents for directories.
* On SunOS systems (including Solaris and SmartOS), this uses event ports.
* On Windows systems, this feature depends on ReadDirectoryChangesW.
* On Aix systems, this feature depends on AHAFS, which must be enabled.


基本的な機能が何らかの理由で利用できない場合、fs.watchは機能しません。たとえば、Vagrant、Dockerなどの仮想化ソフトウェアを使用している場合、ファイルやディレクトリを監視することは信頼できない場合もあり、ネットワークファイルシステム（NFS、SMBなど）やホストファイルシステムでは不可能な場合もあります。

fs.watchFileを利用することはできますが、統計的にポーリングすることはできますが、速度は遅く、信頼性も低くなります。

##### Inodes
// Inodes

LinuxおよびOS Xでは、fs.watch()はinodeへのpathを解決し、inodeを監視します。
監視しているパスが削除されて再作成されると、新しいinodeが割り当てられます。
watchは削除のイベントを発行しますが、元の(オリジナルの)inodeを監視し続け、新しいinodeのイベントはemitされません。
これは予想される動作です。


##### ファイル名の引数
// Filename Arguments
callbackにfilename引数を指定するのは、LinuxとWindowsのみサポートされています。
サポートされているプラットフォームであっても、ファイル名は必ず提供されているわけではありません。
よって、filename引数がcallbackに常に提供されているとは想定せず、nullの場合を想定してfallbackするロジックを持つべきです。

```
fs.watch('somedir', (eventType, filename) => {
  console.log(`event type is: ${eventType}`);
  if (filename) {
    console.log(`filename provided: ${filename}`);
  } else {
    console.log('filename not provided');
  }
});
```


### fs.watchFile(filename[, options], listener)

* filename <String> | <Buffer>
* options <Object>
  * persistent <Boolean>
  * interval <Integer>
* listener <Function>


filenameで指定されたファイルの監視をします。
listenerはファイルにアクセスするたびに呼び出されます。

optionsは省略することが出来ますが、省略しない場合はObjectである必要があります。
options オブジェクトはファイルが監視されている限りプロセスを実行し続けるかどうかを表すpersistentというbooleanの値を持つことができます。
optionsは同じように、監視対象に対してポーリングする頻度をミリ秒で設定できるintervalプロパティも持つことが出来ます。
デフォルトは{ persistent: true, interval: 5007 }です

listenerは、現在と過去の2つのstatオブジェクトを持つことが出来ます。
```
fs.watchFile('message.text', (curr, prev) => {
  console.log(`the current mtime is: ${curr.mtime}`);
  console.log(`the previous mtime was: ${prev.mtime}`);
});
```

このstat objectsはfs.Statのインスタンスです。

ファイルが変更された時に通知されますが、アクセスするだけでなく、curr.mtimeとprev.mtimeを比較する必要があります。

注意：fs.watchFile()操作でENOENTエラーが発生すると、全てのフィールドが0になった(もしくは全てunix エポックタイムになった)リスナーが1°呼び出されます。
Windowsでは、blksizeとblocksフィールドがundefinedとなります。

あとでファイルが作成されると、最新のstatオブジェクトを用いてlistnerがもう一度呼び出されます。
この変更はv0.10.0から行われています。


注意：fs.watch（）はfs.watchFileとfs.unwatchFileより効率的です。 fs.watchFileとfs.unwatchFileの代わりにfs.watchを使用する必要があります。


### fs.write(fd, buffer, offset, length[, position], callback)

* fd <Integer>
* buffer <String> | <Buffer>
* offset <Integer>
* length <Integer>
* position <Integer>
* callback <Function>


fdで指定されたファイルにbufferを書き込みます。

offsetは、書き込まれるbufferの部分を決定し、lengthは書き込むバイト数を指定する整数です。

positionはこのデータを書きこむファイルの先頭からのオフセットを示しています。
positionがnumberではない場合、現在のポジションからデータは書き込まれます。
pwirte(2)を参照ください。

callbackにはerr, written, bufferの3つの値が与えられ、writtenはbufferから書き込まれたバイト数を指定しています。

注意：callbackを待たずに、同じファイルにfs.writeすることは安全ではないことに注意してください。
そのような場合はfs.createWriteStreamを利用することを強く推奨します。

Linuxでは、ファイルが追加モードで開かれると位置指定した書き込みは機能しません。
位置を指定する引数は引数は無視され、いつもファイルの最後にデータを追加します。



### fs.write(fd, data[, position[, encoding]], callback)

* fd <Integer>
* data <String> | <Buffer>
* position <Integer>
* encoding <String>
* callback <Function>


fdで指定されたファイルにdataを書き込みます。
dataがBufferインスタンスではない場合、値は文字列に変換されます。

positionがnumberではない場合、現在のポジションからデータは書き込まれます。
pwirte(2)を参照ください。

encodingは文字列のエンコーディングです。

callbackには、err, written, stringの3つの引数が与えられ、writtenは渡された文字列が書き込まれる必要ががあるバイト数を指定します。
ここの書き込まれるバイト数は、stringの文字列のバイト数と同じではありません。
Buffer.byteLengthを参照ください。

Bufferを使った書き込みのときとは違い、文字列全体を書き込む必要があります。
部分的な文字列は指定できません。
これは、結果のデータのbyteOffsetと文字列のoffsetが同じではない可能性があるためです。

注意：callbackを待たずに、同じファイルにfs.writeすることは安全ではないことに注意してください。
そのような場合はfs.createWriteStreamを利用することを強く推奨します。

Linuxでは、ファイルが追加モードで開かれると位置指定した書き込みは機能しません。
位置を指定する引数は引数は無視され、いつもファイルの最後にデータを追加します。


### fs.writeFile(file, data[, options], callback)

* file <String> | <Buffer> | <Integer> filename or file descriptor
* data <String> | <Buffer>
* options <Object> | <String>
  * encoding <String> | <Null> default = 'utf8'
  * mode <Integer> default = 0o666
  * flag <String> default = 'w'
* callback <Function>


非同期でデータをファイルに書き込み、ファイルが既に存在する場合は置き換えます。
dataはstringかbufferです。

encodingはbufferの場合は無視されます。デフォルトはutf8です。


例：

```
fs.writeFile('message.txt', 'Hello Node.js', (err) => {
  if (err) throw err;
  console.log('It\'s saved!');
});
```

optionsはstringの場合、エンコーディングを指定します。

```
fs.writeFile('message.txt', 'Hello Node.js', 'utf8', callback);
```

### fs.writeFileSync(file, data[, options])

* file <String> | <Buffer> | <Integer> filename or file descriptor
* data <String> | <Buffer>
* options <Object> | <String>
  * encoding <String> | <Null> default = 'utf8'
  * mode <Integer> default = 0o666
  * flag <String> default = 'w'


fs.writeFile()の同期バージョンです。undefinedが返されます。

指定されたファイルディスクリプタは、すべての書き込みをサポートする必要があります。

callbackを待たずに同じファイルに対してfs.writeFileを複数回指定することは安全ではないことに注意してください。
そのような場合、fs.createWriteStreamを利用することを強くおすすめします。


### fs.writeSync(fd, buffer, offset, length[, position])

* fd <Integer>
* buffer <String> | <Buffer>
* offset <Integer>
* length <Integer>
* position <Integer>


// 説明が一切ないのでチャンス？

### fs.writeSync(fd, data[, position[, encoding]])

* fd <Integer>
* data <String> | <Buffer>
* position <Integer>
* encoding <String>


fs.write()の同期的なバージョンです。
書き込まれたbytesの数値が返されます。

### FS Constants

次の定数はfs.Constantsでエクスポートされています。

注意：すべてのOSですべての定数を使えるわけではありません。

#### ファイルアクセス用の定数
fs.accessで利用するための定数です。

Constant	Description
F_OK	Flag indicating that the file is visible to the calling process.
R_OK	Flag indicating that the file can be read by the calling process.
W_OK	Flag indicating that the file can be written by the calling process.
X_OK	Flag indicating that the file can be executed by the calling process.

#### ファイルオープン用の定数

fs.open()で利用するための定数です。

O_RDONLY	Flag indicating to open a file for read-only access.
O_WRONLY	Flag indicating to open a file for write-only access.
O_RDWR	Flag indicating to open a file for read-write access.
O_CREAT	Flag indicating to create the file if it does not already exist.
O_EXCL	Flag indicating that opening a file should fail if the O_CREAT flag is set and the file already exists.
O_NOCTTY	Flag indicating that if path identifies a terminal device, opening the path shall not cause that terminal to become the controlling terminal for the process (if the process does not already have one).
O_TRUNC	Flag indicating that if the file exists and is a regular file, and the file is opened successfully for write access, its length shall be truncated to zero.
O_APPEND	Flag indicating that data will be appended to the end of the file.
O_DIRECTORY	Flag indicating that the open should fail if the path is not a directory.
O_NOATIME	Flag indicating reading accesses to the file system will no longer result in an update to the atime information associated with the file. This flag is available on Linux operating systems only.
O_NOFOLLOW	Flag indicating that the open should fail if the path is a symbolic link.
O_SYNC	Flag indicating that the file is opened for synchronous I/O.
O_SYMLINK	Flag indicating to open the symbolic link itself rather than the resource it is pointing to.
O_DIRECT	When set, an attempt will be made to minimize caching effects of file I/O.
O_NONBLOCK	Flag indicating to open the file in nonblocking mode when possible.


#### ファイルタイプ定数
fs.Statsオブジェクトのmodeプロパティでファイルタイプを決定するために使用される定数です。

S_IFMT	Bit mask used to extract the file type code.
S_IFREG	File type constant for a regular file.
S_IFDIR	File type constant for a directory.
S_IFCHR	File type constant for a character-oriented device file.
S_IFBLK	File type constant for a block-oriented device file.
S_IFIFO	File type constant for a FIFO/pipe.
S_IFLNK	File type constant for a symbolic link.
S_IFSOCK	File type constant for a socket.


#### ファイルモード定数

fs.Stats オブジェクトのmodeプロパティと一緒にaccessの許可を決定するためのオブジェクトです。

S_IRWXU	File mode indicating readable, writable and executable by owner.
S_IRUSR	File mode indicating readable by owner.
S_IWUSR	File mode indicating writable by owner.
S_IXUSR	File mode indicating executable by owner.
S_IRWXG	File mode indicating readable, writable and executable by group.
S_IRGRP	File mode indicating readable by group.
S_IWGRP	File mode indicating writable by group.
S_IXGRP	File mode indicating executable by group.
S_IRWXO	File mode indicating readable, writable and executable by others.
S_IROTH	File mode indicating readable by others.
S_IWOTH	File mode indicating writable by others.
S_IXOTH	File mode indicating executable by others.

#### 参考
http://html5.ohtsu.org/nodejuku01/nodejuku01_ohtsu.pdf
http://www.slideshare.net/shigeki_ohtsu/processnext-tick-nodejs
