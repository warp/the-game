import http from 'http'
import socketIo from 'socket.io'
import fs from 'fs'

const PORT = 8080

var app = http.createServer(handler)
var io = socketIo(app)

app.listen(PORT)

console.log('Running on http://localhost:' + PORT)

function handler (req, res) {
  var path = '/' + (req.url.replace(/^\//, '') || 'index.html')
  fs.readFile(__dirname + path, function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading ' + path);
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
