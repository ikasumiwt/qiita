const fs = require('fs');
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

process.on('uncaughtException', (err) => {
  console.log('whoops! there was an error');
});

fs.stat('/tmp/world', (err, stats) => {
  if (err) throw err;
  /*
  if (err) {
    myEmitter.emit('error', (err) => {
      console.log('some error happened');
    });
  }
  */

  console.log(`stats: ${JSON.stringify(stats)}`);
});


