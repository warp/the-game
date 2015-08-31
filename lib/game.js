import p2 from 'p2'

export default class Game {

  constructor() {
    this.world = new p2.World({
      gravity: [0, -9.82]
    })
    this.ship = new p2.Body({
      mass: 5,
      allowSleep: false,
      position: [200, -100]
    });
    this.ship.addShape(new p2.Convex({ vertices: [[0, -2], [2, 1], [-2, 1]] }))

    this.world.addBody(this.ship)

    var ground = new p2.Body({
      mass: 0,
      position: [0, -500]
    })
    ground.addShape(new p2.Plane())    
    this.world.addBody(ground)

    this.state = {
      ship: { x: 200, y: 200, a: 0, thrusting: false, acceleration: 0 }
    }
  }

  tick(timeStep) {
    if (this.state.ship.thrusting) {
      this.ship.applyForceLocal([0, 100], [0.5, 1])
    }
    this.world.step(timeStep);
    this.state.ship.x = this.ship.position[0]
    this.state.ship.y = -this.ship.position[1]
    this.state.ship.a = this.ship.angle
  }
}


