// Optional local preview; the app itself is entirely static.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const files = { '/': ['index.html', 'text/html'], '/index.html': ['index.html', 'text/html'], '/style.css': ['style.css', 'text/css'], '/app.js': ['app.js', 'text/javascript'] };
http.createServer((request, response) => {
  const file = files[new URL(request.url, 'http://localhost').pathname];
  if (!file) { response.writeHead(404); response.end('Not found'); return; }
  response.writeHead(200, { 'Content-Type': `${file[1]}; charset=utf-8` });
  fs.createReadStream(path.join(__dirname, file[0])).pipe(response);
}).listen(5173, '127.0.0.1', () => console.log('Weekbox: http://127.0.0.1:5173'));
