const fs = require('fs');

fs.stat('/tmp/hello', (err, stats) => {
  if (err) throw err;
  console.log(`stats: ${JSON.stringify(stats)}`);
});
