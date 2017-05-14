'use strict';

const fs = require('fs');
const path = require('path');

let debug = false;
let option = process.argv[2];
let srcPath = process.argv[3];
let destPath = process.argv[4];

if(debug === true) {
  console.log('process.argv');
  console.log(process.argv[3]);
  console.log(process.argv[4]);

  for(var i = 0; i < process.argv.length; i++) {
    console.log(process.argv[i]);
  }

};

/* 
 * -a == -rlptgoD 
 * -r 再帰的にコピーする
 * -l シンボリックリンクの確認とコピー
 * -p パーミッションを確認してそのままコピー
 * -t タイムスタンプのチェックとコピー
 * -g グループをそのままコピー
 * -o オーナーのチェックとコピー
 * -D  ブロックデバイスをコピー  (?)
 */


/*
 * やること
 * srcPathのデータを取得
 * 上のオプションの処理を実行しながらdestPathにコピー
 */
let main = () => {

  //とりあえずaオプションのみに
  if(option !== '-a'){
    console.log('no option');
    return;
  } else if(srcPath === undefined || destPath === undefined) {
    console.log('path is not found');
    return;
  }
  
  readdirPromise(srcPath, readdirCallback)
    .then((files)=> {
        readdirCallback(null, files);
    })
    .catch((err) => {
      console.log('readdir callback error');
    });
};

// lstatのpromise版
let lstatPromise = (path) => {

  return new Promise((resolve, reject) => {
    fs.lstat(path, (err, stats) => {
      if(err) reject(err);
      resolve(stats);
    });
  });
};

// statのpromise版
let statPromise = (path) => {

  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if(err) reject(err);
      resolve(stats);
    });
  });
};

// readdir promise版
let readdirPromise = (path) => {

  return new Promise((resolve, reject) => {
    fs.readdir(srcPath, (err, files) => {
      if(err) reject(err);
      resolve(files);
    });
  });
};

// access promise版
let accessPromise = (path, mode) => {

  return new Promise((resolve, reject) => {
    fs.access(path, mode, (err) => {
      // errの場合はアクセス不可
      if(err) reject();
      resolve();
    });
  });
};


// chmod promise版
let chmodPromise = (path, mode) => {

  return new Promise((resolve, reject) => {
    fs.chmod(path, mode, (err) => {
      if(err) reject();
      resolve();
    });
  });
};


// chown promise版
let chownPromise = (path, uid, gid) => {

  return new Promise((resolve, reject) => {
    fs.chown(path, uid, gid, (err) => {
      if(err) reject();
      resolve();
    });
  });
};

// utimes promise版
let utimesPromise = (path, atime, utime) => {

  return new Promise((resolve, reject) => {
    fs.utimes(path, atime, utime, (err) => {
      if(err) reject();
      resolve();
    });
  });
};

// 権限情報関係の書き換え
let changeStats = (filename, stats) => {

  return new Promise((resolve, reject) => {
    let promises = [];
    promises.push(utimesPromise(destPath + filename, stats.atime, stats.utime));
    promises.push(chmodPromise(destPath + filename, stats.mode));
    promises.push(chownPromise(destPath + filename, stats.uid, stats.gid));
    Promise.all(promises)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      })
  });
};

// writefile promise版
let writeFilePromise = (filename, data) => {

  return new Promise((resolve, reject) => {
    // 与えられたファイルのチェック(isSymbolicLinkがlstat onlyのため)
    lstatPromise(srcPath + filename)
      .then((stats) => {
          // symbolic linkの場合
          if(stats.isSymbolicLink()) {
            // windowsは絶対パスの必要が...
            
            // symlink先のpathを取得し、そちらにsymlinkする(絶対パス)
            fs.realpath(srcPath + filename, (err, resolvedPath) => {
              fs.symlink(resolvedPath, destPath + filename, (err) => {
                if(err) reject(err);
                
                // symlink後に諸々変更
                changeStats(filename, stats);

                resolve();
              })
            });

          } else {
            
            let readStream = fs.createReadStream(srcPath + filename);
            let writeStream = fs.createWriteStream(destPath + filename);
            
            readStream.pipe(writeStream);
            writeStream.on('close', () => {
              // close後にパーミッション系の変更をする
              changeStats(filename, stats);
            });
          }

      })
      .catch((err) => {
        // console.log(err);
        reject(err);
      });
    
    //resolve();
  });
};

// ファイルを書き出し
let readdirCallback = (err, files) => {
  // readdir自体のerror
  // console.log(files);

  let promises = [];
  for(let i =0; i < files.length; i++) {
    promises.push(writeFilePromise(files[i]));
  };

  Promise.all(promises)
    .then(() => {
      console.log('then end');
    })
    .catch((err) => {
      // errorの場合最初のerrを表示
      console.log(err);
    });
}


// 実行
main();


