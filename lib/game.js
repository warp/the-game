import p2 from 'p2'

export default class Game {
  constructor() {
    this.state = { ships: [] }
    this.shipBodies = []

    this.world = new p2.World({
      gravity: [0, -9.82]
    })

    var ground = new p2.Body({
      mass: 0,
      position: [0, -500]
    })

    ground.addShape(new p2.Plane())

    this.world.addBody(ground)
    this.addShip()
  }

  addShip() {
    let shipBody = new p2.Body({
      mass: 500,
      allowSleep: false,
      position: [Math.random() * 500, - Math.random() * 200]
    })

    shipBody.addShape(new p2.Convex({ vertices: [[0, 2], [-2, -1], [2, -1]] }))

    this.world.addBody(shipBody)
    this.shipBodies.push(shipBody)
    this.state.ships.push({
      x: shipBody.position[0],
      y: -shipBody.position[1],
      angle: 0,
      thrusting: false,
      left: false,
      right: false,
      name: `Player ${this.shipBodies.length}`
    })
  }

  tick(timeStep) {
    this.shipBodies.forEach((shipBody, i) => {
      shipBody.angularVelocity = 0
      if (this.state.ships[i].thrusting) {
        shipBody.applyForceLocal([0, 20000], [0, 1])
      }
      if (this.state.ships[i].left) {
        shipBody.angularVelocity = 1
      }
      if (this.state.ships[i].right) {
        shipBody.angularVelocity = -1
      }
      this.world.step(timeStep)
      this.state.ships[i].x = shipBody.position[0]
      this.state.ships[i].y = -shipBody.position[1]
      this.state.ships[i].angle = shipBody.angle
    })
  }
}
