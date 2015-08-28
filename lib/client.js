class Client {
  bootstrap() {
    var stage = new Stage()
    var socket = io('http://localhost:8080')

    socket.on('state', function(gameState) {
      new Painting(stage, gameState).perform()
    })
  }

  static bootstrap(){
    let client = new Client()
    client.bootstrap()
  }
}

class Painting {
  constructor(stage, gameState) {
    this.stage = stage
    this.context = stage.context
    this.gameState = gameState
  }

  perform() {
    this.erase()
    this.drawBackground()
    this.drawShip()
  }

  erase() {
    this.draw(function(context, stage) {
      context.clearRect(0, 0, stage.width(), stage.height())
    })
  }

  drawShip() {
    var ship = this.gameState.ship

    this.draw(function(context) {
      context.fillStyle = 'rgb(227, 61, 39)'
      this.drawTriangle(ship.x, ship.y, 30)
      context.fill()
    })
  }

  drawBackground() {
    this.draw(function(context, stage) {
      context.fillStyle = 'rgb(227, 227, 227)'
      context.fillRect(0, 0, stage.width(), stage.height());
    })
  }

  drawTriangle(x, y, size) {
    this.draw(function(context) {
      context.beginPath()
      context.moveTo(x, y - size / 2)
      context.lineTo(x + size / 2, y + size / 2)
      context.lineTo(x - size / 2, y + size / 2)
    })
  }

  draw(callback) {
    this.context.save()
    callback.call(this, this.context, this.stage)
    this.context.restore()
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
