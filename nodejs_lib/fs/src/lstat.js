const fs = require('fs');

fs.lstat('./stat/', (err, stats) => {

  if(err) console.log(err);

  console.log(stats);
});
