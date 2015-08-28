import http from 'http'
import socketIo from 'socket.io'
import fs from 'fs'

const PORT = 8080

var app = http.createServer(handler)
var io = socketIo(app)

app.listen(PORT)

class Game {
  constructor() {
    this.state = { ship: { x: 50, y: 50 } }
  }

  tick() {
    this.state.ship.y += 0.5
  }
}

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
    game.tick()
    socket.emit('state', game.state);
  }, 20)

  socket.on('thrust', function (data) {
    console.log(data);
  });
});
