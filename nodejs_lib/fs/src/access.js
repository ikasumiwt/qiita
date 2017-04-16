var fs = require('fs');

fs.access('/etc/passwd', (err) => {
  console.log(err ? 'no access!' : 'can read/write');
});

