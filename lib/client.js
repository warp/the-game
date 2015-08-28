class Client {
  bootstrap() {
    this.stage = new Stage()
    this.painter = new Painter(this.stage)
    this.painter.paint({})
  }

  static bootstrap(){
    let client = new Client()
    client.bootstrap()
  }
}

class Painter {
  constructor(stage) {
    this.stage = stage
  }

  paint() {
    this.erase()
    this.drawBackground()
  }

  erase() {
    this.stage.draw(function(stage) {
      this.clearRect(0, 0, stage.width(), stage.height())
    })
  }

  drawBackground() {
    this.stage.draw(function(stage) {
      this.fillStyle = 'rgb(227, 227, 227)'
      this.fillRect(0, 0, stage.width(), stage.height());
    })
  }
}

class Stage {
  constructor() {
    this.materialize()
    this.bindToEvents()
  }

  materialize() {
    this.parent = document.body
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')

    this.parent.appendChild(this.canvas)
    this.resize()
  }

  bindToEvents() {
    window.addEventListener('resize', this.resize.bind(this))
  }

  draw(callback) {
    callback.call(this.context, this)
  }

  width() {
    return this.canvas.width
  }

  height() {
    return this.canvas.height
  }

  resize() {
    this.canvas.width = this.parent.offsetWidth
    this.canvas.height = this.parent.offsetHeight
  }
}

Client.bootstrap()

var socket = io('http://localhost:8080');
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});
