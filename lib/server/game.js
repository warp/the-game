import p2 from 'p2'
import ColourFixtures from './colour-fixtures'
import Ship from './ship'

export default class Game {
  constructor() {
    this.ships = []
    this.palette = ColourFixtures.munin
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
