'use strict';

const fs = require('fs');
const path = require('path');

let option = process.argv[2];
let srcPath = process.argv[3];
let destPath = process.argv[4];

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
        readdirCallback(files);
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
    fs.readdir(path, (err, files) => {
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
let utimesPromise = (path, atime, mtime) => {

  return new Promise((resolve, reject) => {
    fs.utimes(path, atime, mtime, (err) => {
      if(err) reject();
      resolve();
    });
  });
};

// 権限情報関係の書き換え
let changeStats = (filename, stats) => {

  return new Promise((resolve, reject) => {
    let promises = [];
    promises.push(utimesPromise(destPath + filename, stats.atime, stats.mtime));
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
let writeFilePromise = (filename, targetDir) => {

  if(targetDir === undefined) targetDir = '';
  
  return new Promise((resolve, reject) => {
    // 与えられたファイルのチェック(isSymbolicLinkがlstat onlyのため)
    lstatPromise(srcPath + targetDir + filename)
      .then((stats) => {
          
          // . or .. の場合はスルー
          if(filename === '.' || filename === '..') {

            console.log('this filename is . or .. : ' + filename);
          // symbolic linkの場合 ... timestampの書き換えは無理
          } else if(stats.isSymbolicLink()) {
            
            console.log('this file is symboloc link:' + filename);
            // symlink先のpathを取得し、そちらにsymlinkする(絶対パス)
            fs.realpath(srcPath + targetDir + filename, (err, resolvedPath) => {
              fs.symlink(resolvedPath, destPath + targetDir + filename, (err) => {
                if(err) reject(err);
                
                // symlink後に諸々変更
                changeStats(targetDir + filename, stats);

                resolve();
              })
            });

          /*
           * dirの場合
           * 存在しなければ、destPathにmkdirする
           * srcPath/dir 以下を再帰的にreaddir処理する
           */
          } else if(stats.isDirectory()) {
            // filenameがdirectoryのため、再帰的に処理する
            console.log('this is directory : ' + filename);
            
            // mkdirする

            fs.mkdir(destPath + targetDir + filename, (err) => {
              if(err) reject(err);

              // ここで指すfilenameはdirectory
              console.log(srcPath + targetDir + filename + '/');
              readdirPromise(srcPath + targetDir + filename)
                .then((files) => {
                  // targetDirを明示する
                  readdirCallback(files, targetDir + filename + '/');
                  resolve();
                })
                .catch((err) => {
                  console.log('readdir callback error');
                  reject(err);
                });
            
            });

          // それ以外の時（通常のファイルの時）
          } else {
            
            let readStream = fs.createReadStream(srcPath + targetDir + filename);
            let writeStream = fs.createWriteStream(destPath + targetDir + filename);
            
            readStream.pipe(writeStream);
            writeStream.on('close', () => {
              // close後にパーミッション系の変更をする
              changeStats(targetDir + filename, stats);
              resolve();
            });
          }

      })
      .catch((err) => {
        reject(err);
      });
    
    //resolve();
  });
};

// ファイルを書き出し
let readdirCallback = (files, targetDir) => {
  // readdir自体のerror
  
  let promises = [];

  if(targetDir === undefined) targetDir = '';
  for(let i = 0; i < files.length; i++) {
    promises.push(writeFilePromise(files[i], targetDir));
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


