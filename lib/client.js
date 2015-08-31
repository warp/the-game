class Client {
  bootstrap() {
    var stage = new Stage()
    var input = new InputListener()
    var socket = io('http://localhost:8080')

    input.events.on('stateChange', function(state) {
      socket.emit('inputState', state)
    })

    socket.on('state', function(gameState) {
      new Painting(stage, gameState).perform()
    })
  }

  static bootstrap(){
    let client = new Client()
    client.bootstrap()
  }
}

class EventStream {
  constructor() {
    this.listeners = {}
  }

  on(eventName, callback) {
    this.listeners[eventName] = this.listeners[eventName] || []
    this.listeners[eventName].push(callback)
  }

  broadcast(eventName, ...data) {
    (this.listeners[eventName] || []).forEach(function(callback) {
      callback.call(null, ...data)
    })
  }
}

class InputListener {
  constructor() {
    this.events = new EventStream()
    this.state = {}
    this.bindToEvents()
  }

  keyCodeAction(keyCode) {
    var keyCodeToActionMappings = {
      38: 'thrust'
    }

    return keyCodeToActionMappings[keyCode]
  }

  bindToEvents() {
    window.addEventListener('keydown', this.setState(true))
    window.addEventListener('keyup', this.setState(false))
  }

  setState(value) {
    return function(event) {
      var action = this.keyCodeAction(event.keyCode)

      if(action) {
        this.state[action] = value
      }

      this.events.broadcast('stateChange', this.state)
    }.bind(this)
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
      this.drawTriangle(ship.x, ship.y, 30, ship.a)
      context.fill()
    })
  }

  drawBackground() {
    this.draw(function(context, stage) {
      context.fillStyle = 'rgb(227, 227, 227)'
      context.fillRect(0, 0, stage.width(), stage.height());
    })
  }

  drawTriangle(x, y, size, angle) {
    angle *= Math.PI / 180
    var cos = Math.cos(angle)
    var sin = Math.sin(angle)
    this.draw(function(context) {
      context.beginPath()
      var path = [
        [0, -size / 2],
        [size / 2, size / 2],
        [-size / 2, size / 2]
      ].map(([px, py]) => [
        px * cos - py * sin + x,
        px * sin + py * cos + y
      ])
      context.moveTo(path[0][0], path[0][1])
      context.lineTo(path[1][0], path[1][1])
      context.lineTo(path[2][0], path[2][1])
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
