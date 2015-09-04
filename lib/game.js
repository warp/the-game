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

    this.world.islandSplit = true;
    this.world.sleepMode = p2.World.ISLAND_SLEEPING;
    this.world.solver.iterations = 20;
    this.world.solver.tolerance = 0.001;

    this.world.on('beginContact', ({bodyA, bodyB}) => {
      if (bodyA && bodyB) {
        if (bodyA.ship && bodyB.ship) {
          if (bodyA.ship.hasDoge) {
            bodyA.ship.hasDoge = false
            bodyB.ship.hasDoge = true
          } else if (bodyA.ship.hasDoge) {
            bodyA.ship.hasDoge = true
            bodyB.ship.hasDoge = false
          }
        }
      }
    })

    this.addBounds()
  }

  addBounds() {
    this.addBoundary(0, 600, 0)
    this.addBoundary(0, 0, Math.PI)
    this.addBoundary(1000, 0, Math.PI * 0.5)
    this.addBoundary(0, 0, Math.PI * 1.5)
  }

  addBoundary(x, y, angle) {
    const boundary = new p2.Body({
      mass: 0,
      position: [x, -y],
      angle: angle
    })

    boundary.addShape(new p2.Plane())

    this.world.addBody(boundary)
  }

  addShip(client, name) {
    let ship = new Ship()
    ship.name = name
    ship.colour = this.palette.nextColour()
    ship.client = client;
    this.ships.push(ship)
    this.world.addBody(ship.body)
    this.checkDoge()
    return ship
  }

  checkDoge() {
    if (!this.dogePresent()) {
      this.pickDoge()
    }
  }

  dogePresent() {
    return this.ships.reduce((hasDoge, ship) => ship.hasDoge || hasDoge, false)
  }

  pickDoge() {
    this.ships[parseInt(Math.random() * this.ships.length -1, 10)].hasDoge = true
  }

  removeShip(ship) {
    let i = this.ships.indexOf(ship)

    this.checkDoge()

    if (i > -1) {
      this.ships.splice(i, 1)
      this.world.removeBody(ship.body)
      return ship
    }
    else {
      return false
    }
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
  get size() {
    return 30
  }

  get body() {
    this._body = this._body || this.buildBody()
    return this._body
  }

  constructor() {
    this.hasDoge = false
  }

  tick(timeStep) {
    if(this.thrusting) {
      this.body.applyForceLocal([0, 20000], [0, -this.size / 2])
    }

    if(this.left) {
      this.body.applyForceLocal([-5000, 0], [0, this.size / 2])
    }

    if(this.right) {
      this.body.applyForceLocal([5000, 0], [0, this.size / 2])
    }
  }

  buildBody() {
    let body = new p2.Body({
      mass: 500,
      allowSleep: false,
      position: [Math.random() * 500, - Math.random() * 200]
    })

    let shape = new p2.Convex({
      vertices: [
        [0, this.size / 2],
        [-this.size / 2, -this.size / 2],
        [this.size / 2, -this.size / 2]
      ]
    })
    body.addShape(shape)

    body.ship = this

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
      x: Math.round(this.x),
      y: Math.round(this.y),
      rotation: Number(this.rotation.toFixed(2)),
      thrusting: this.thrusting,
      doge: this.hasDoge,
      name: this.name
    }
  }
}
