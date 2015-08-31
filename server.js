import http from 'http'
import socketIo from 'socket.io'
import fs from 'fs'

import Game from './lib/game'

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

var game = new Game()

io.on('connection', function (socket) {
  setInterval(function(){
    game.tick(0.02)
    socket.emit('state', game.state);
  }, 20)


  setInterval(function(){
    console.log(game.state)
  }, 1000)

  socket.on('inputState', function (state) {
    game.state.ship.thrusting = state.thrust
  });
});
