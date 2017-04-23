const fs = require('fs');

new Promise( (resolve, reject) => {
  fs.stat('/tmp/hello', (err, stats) => {
  //fs.stat('/tmp/world', (err, stats) => {
    if (err) reject(err);
    
    resolve(`stats: ${JSON.stringify(stats)}`);
    //console.log(`stats: ${JSON.stringify(stats)}`);
  })
}).then((err) => {
  console.log('then func');
}).catch((err) => {
  console.log('catched');
});
