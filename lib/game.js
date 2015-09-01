import p2 from 'p2'

export default class Game {
  constructor() {
    this.ships = []

    // Munin colours
    this.palette = new Palette([
      '#00cc00',
  		'#0066b3',
  		'#ff8000',
  		'#ffcc00',
  		'#330099',
  		'#990099',
  		'#ccff00',
  		'#ff0000',
  		'#808080',
  		'#008f00',
  		'#00487d',
  		'#b35a00',
  		'#b38f00',
  		'#6b006b',
  		'#8fb300',
  		'#b30000',
  		'#bebebe',
  		'#80ff80',
  		'#80c9ff',
  		'#ffc080',
  		'#ffe680',
  		'#aa80ff',
  		'#ee00cc',
  		'#ff8080',
  		'#666600',
  		'#ffbfff',
  		'#00ffcc',
  		'#cc6699',
  		'#999900'
    ])

    this.world = new p2.World({
      gravity: [0, -9.82]
    })

    var ground = new p2.Body({
      mass: 0,
      position: [0, -500]
    })

    ground.addShape(new p2.Plane())

    this.world.addBody(ground)
  }

  addShip() {
    let ship = new Ship()
    ship.colour = this.palette.nextColour()
    this.ships.push(ship)
    this.world.addBody(ship.body)
    return ship
  }

  get state() {
    return {
      ships: this.ships.map(ship => ship.state)
    }
  }

  tick(timeStep) {
    this.ships.forEach(ship => ship.tick(timeStep))
    this.world.step(timeStep)
  }
}

class Palette {
  constructor(colours) {
    this.colours = colours
  }

  nextColour() {
    let colour = this.colours.shift()
    this.colours.push(colour)
    return colour
  }
}

class Ship {
  get body() {
    this._body = this._body || this.buildBody()
    return this._body
  }

  tick(timeStep) {
    this.body.angularVelocity = 0

    if(this.thrusting) {
      this.body.applyForceLocal([0, 20000], [0, 1])
    }

    if(this.left) {
      this.body.angularVelocity = 1
    }

    if(this.right) {
      this.body.angularVelocity = -1
    }
  }

  buildBody() {
    let body = new p2.Body({
      mass: 500,
      allowSleep: false,
      position: [Math.random() * 500, - Math.random() * 200]
    })

    body.addShape(new p2.Convex({ vertices: [[0, 2], [-2, -1], [2, -1]] }))

    return body
  }

  get rotation() {
    return this.body.angle
  }

  get x() {
    return this.body.position[0]
  }

  get y() {
    return -this.body.position[1]
  }

  get state() {
    return {
      colour: this.colour,
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      name: this.name
    }
  }
}
