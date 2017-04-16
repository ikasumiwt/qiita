# notes
https://github.com/nodejs/node/blob/v6.9.1-proposal/lib/buffer.js
の読み物です。

## Node.js v6.9.1 Documentation

[docs](https://nodejs.org/dist/latest-v6.x/docs/api/buffer.html)

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

- eventType : String
- filename : String| Buffer

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

- fd : Integer / Readable Streamで利用される識別子です

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


- stats.isFile()
- stats.isDirectory()
- stats.isBlockDevice()
- stats.isCharacterDevice()
- stats.isSymbolicLink() (only valid with fs.lstat())
- stats.isFIFO()
- stats.isSocket()

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

- atime : "Access Time"

ファイルデータに最後にアクセスした時間です。
mknod(2), utimes(2), and read(2) のシステムコールによって変更されます。

- mtime : "Modified Time"

ファイルデータが最後に修正された時間です。
mknod(2), utimes(2), and read(2) のシステムコールによって変更されます。

- ctime : "Change Time"

ファイルデータが最後に変更された(inodeデータの修正された)時間です。
mknod(2), utimes(2), and read(2) のシステムコールによって変更されます。

- birthtime : "Birth Time"

ファイルの作成時間です。ファイルが作成される時に一度だけセットされます。
birthtimeが存在しないファイルシステムでは、このフィールドはctimeか1970-01-01T00:00Z(unix timestampの0)が保存される可能性があります。
この値は、atimeやmtimeより大きい場合があります。

DarwinやFreeBSDの亜種では、同じようにatimeがutimes(2)のシステムコールを使って現在のbirthtimeよりも前の値に設定されている場合にも設定されます。


Node v0.12以前では、ctimeはWindowsシステム上ではbirthtimeを保持していました、
v0.12のときには、ctimeはunix上ではcreation timeではなかったことに注意してください、


### Class: fs.WriteStream

WriteStreamはWritable Streamです。

#### Event: open

- fd : Integer / WriteStreamに利用するファイルディスクリプタの整数です。

WriteStreamのファイルをオープンした時に発行されます。

#### Event: close

WriteStreamの根底にあるファイルディスクリプタが、fs.close()メソッドで閉じられた際に発行されます。

#### writeStream.bytesWritten

これまでに書き込まれたバイト数です。書き込むキューにまだ残っているデータは含まれません。

#### writeStream.path

fs.createWriteStreamの最初の引数で指定されている、streamが書き込んでいるファイルへのパスです。

pathが文字列で渡された場合は文字列になりますが、Bufferで渡された場合はwriteStream.pathはBufferになります。

### fs.access(path[, mode], callback)

- path <String> | <Buffer>
- mode <Integer>
- callback <Function>

pathによって指定されたファイル/ディレクトリに対するユーザーのパーミッションをテストします。
引数のmodeは実行されるアクセシビリティのチェックのオプションの整数です。

以下の定数は、modeで指定できることができる値です。

2つ以上の値はビット単位のORをマスクで作ることが可能です。

- fs.constants.F_OK

pathは呼ばれるプロセスから見えます。
これは、ファイルが存在するのかを判断するのには便利だけれど、rwxの権限についてはなにもわかりません。
モードが指定されていない場合のデフォルトの値です。

- fs.constants.R_OK

pathが呼び出し元のプロセスによってreadできるかテストするmodeです

- fs.constants.W_OK

pathが呼び出し元のプロセスによってwriteできるかテストするmodeです

- fs.constants.X_OK

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

- path <String> | <Buffer>
- mode <Integer>

fs.access()の同期的なバージョンです。
アクセシビリティのチェックが失敗した場合はthrowされて、それ以外の場合はなにもしないです。


### fs.appendFile(file, data[, options], callback)


- file <String> | <Buffer> | <Number> filename or file descriptor
data <String> | <Buffer>
- options <Object> | <String>
- encoding <String> | <Null> default = 'utf8'
 - mode <Integer> default = 0o666
 - flag <String> default = 'a'
- callback <Function>

非同期的にファイルにデータを追加します。ファイルが存在しない場合はファイルを作ります。
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

- path <String> | <Buffer>
- mode <Integer>
- callback <Function>

chmod(2)を非同期で行います。
可能性のある例外以外の引数(?)はcallbackには渡されません。

### fs.chmodSync(path, mode)

fs.chmod()の同期バージョンです。

### fs.chown(path, uid, gid, callback)

- path <String> | <Buffer>
- uid <Integer>
- gid <Integer>
- callback <Function>

chown(2)の非同期版です。
これも可能性のある例外以外の引数はcallbackには渡されません。

### fs.chownSync(path, uid, gid)

chown(2)の同期バージョンです。

### fs.close(fd, callback)

- fd <Integer>
- callback <Function>

close(2)を非同期でやります。
これも可能性のある例外以外の引数はcallbackには渡されません。

### fs.closeSync(fd)

fs.close()の同期バージョンです。

### fs.constants

ファイルシステムの操作でよく使う定数が含まれているオブジェクトを返します。

現在定義されている定数に関しては[FS constants](https://nodejs.org/dist/latest-v6.x/docs/api/fs.html#fs_fs_constants_1)を参照ください。


### fs.createReadStream(path[, options])

### fs.createWriteStream(path[, options])

### fs.exists(path, callback)

### fs.existsSync(path)

### fs.fchmod(fd, mode, callback)

### fs.fchmodSync(fd, mode)


### fs.fchown(fd, uid, gid, callback)

### fs.fchownSync(fd, uid, gid)

### fs.fdatasync(fd, callback)

### fs.fdatasyncSync(fd)

### fs.fstat(fd, callback)

### fs.fstatSync(fd)


### fs.fsync(fd, callback)

### fs.fsyncSync(fd)

### fs.ftruncate(fd, len, callback)

### fs.ftruncateSync(fd, len)

### fs.futimes(fd, atime, mtime, callback)

### fs.futimesSync(fd, atime, mtime)

### fs.lchmod(path, mode, callback)

### fs.lchmodSync(path, mode)

### fs.lchown(path, uid, gid, callback)

### fs.lchownSync(path, uid, gid)

### fs.link(existingPath, newPath, callback)


### fs.linkSync(existingPath, newPath)


### fs.lstat(path, callback)

### fs.lstatSync(path)

### fs.mkdir(path[, mode], callback)


### fs.mkdirSync(path[, mode])

### fs.mkdtemp(prefix[, options], callback)

### fs.mkdtempSync(prefix[, options])


### fs.open(path, flags[, mode], callback)

### fs.openSync(path, flags[, mode])

### fs.read(fd, buffer, offset, length, position, callback)

### fs.readdir(path[, options], callback)

### fs.readdirSync(path[, options])

### fs.readFile(file[, options], callback)



### fs.readFileSync(file[, options])


### fs.readlink(path[, options], callback)

### fs.readlinkSync(path[, options])


### fs.readSync(fd, buffer, offset, length, position)

### fs.realpath(path[, options], callback)


### fs.realpathSync(path[, options])

### fs.rename(oldPath, newPath, callback)

### fs.renameSync(oldPath, newPath)

### fs.rmdir(path, callback)

### fs.rmdirSync(path)


### fs.stat(path, callback)

### fs.statSync(path)

### fs.symlink(target, path[, type], callback)

### fs.symlinkSync(target, path[, type])

### fs.truncate(path, len, callback)


### fs.truncateSync(path, len)

### fs.unlink(path, callback)

### fs.unlinkSync(path)

### fs.unwatchFile(filename[, listener])


### fs.utimes(path, atime, mtime, callback)

### fs.utimesSync(path, atime, mtime)

### fs.watch(filename[, options][, listener])

#### Caveats


### fs.watchFile(filename[, options], listener)

### fs.write(fd, buffer, offset, length[, position], callback)

### fs.write(fd, data[, position[, encoding]], callback)

### fs.writeFile(file, data[, options], callback)



### fs.writeFileSync(file, data[, options])



### fs.writeSync(fd, buffer, offset, length[, position])

### fs.writeSync(fd, data[, position[, encoding]])

### FS Constants





#### 参考
http://html5.ohtsu.org/nodejuku01/nodejuku01_ohtsu.pdf
http://www.slideshare.net/shigeki_ohtsu/processnext-tick-nodejs
http://info-i.net/buffer
