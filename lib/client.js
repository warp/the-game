class Client {
  bootstrap() {
    var stage = new Stage()
    var input = new InputListener()
    var socket = io(document.location.protocol + '//' + document.location.host)

    input.events.on('stateChange', function(state) {
      socket.emit('inputState', state)
    })

    socket.on('state', function(gameState) {
      new Rendering(stage, gameState).perform()
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
      38: 'thrust',
      37: 'left',
      39: 'right'
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

class Rendering {
  constructor(stage, gameState) {
    this.stage = stage
    this.context = stage.context
    this.gameState = gameState
  }

  perform() {
    this.erase()
    this.drawBackground()
    this.drawShips()
  }

  erase() {
    this.draw(function(context, stage) {
      context.clearRect(0, 0, stage.width(), stage.height())
    })
  }

  drawShips() {
    this.gameState.ships.forEach(ship => {
      this.draw(function(context) {
        context.fillStyle = 'rgb(227, 61, 39)'
        this.drawTriangle(ship.x, ship.y, 30, ship.rotation)
        context.fill()
      })
    })
  }

  drawBackground() {
    this.draw(function(context, stage) {
      context.fillStyle = 'rgb(227, 227, 227)'
      context.fillRect(0, 0, stage.width(), stage.height());
    })
  }

  drawTriangle(x, y, size, rotation) {
    var cos = Math.cos(-rotation)
    var sin = Math.sin(-rotation)

    var path = [
      [0, -size / 2],
      [size / 2, size / 2],
      [-size / 2, size / 2]
    ].map(([px, py]) => [
      px * cos - py * sin + x,
      px * sin + py * cos + y
    ])

    this.drawPath(path)
  }

  drawPath(points) {
    this.draw(context => {
      context.beginPath()
      context.moveTo.apply(context, points.shift())
      points.forEach(point => context.lineTo.apply(context, point))
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
