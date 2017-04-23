const fs = require('fs');

const sample = fs.createReadStream('sample.txt', {start: 90, end: 99});

sample.on('readable', () => {
  var buf = sample.read();
  console.log('read:', buf);
});

sample.on('end', () => {
  console.log('readstream end')
});
