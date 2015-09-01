import p2 from 'p2'

export default class Game {
  constructor() {
    this.ships = []

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
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      name: this.name
    }
  }
}
