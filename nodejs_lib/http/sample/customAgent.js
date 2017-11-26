const http = require('http');
const keepAliveAgent = new http.Agent({ keepAlive: true });

let options = {}

let onResponseCallback = () => {
  return;
};

options.agent = keepAliveAgent;
http.request(options, onResponseCallback);

