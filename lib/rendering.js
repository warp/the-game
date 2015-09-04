import dogeImage from './doge'

export default class Rendering {
  constructor(stage, gameState, thrusties) {
    this.stage = stage
    this.context = stage.context
    this.gameState = gameState
    this.thrusties = thrusties
  }

  perform() {
    this.erase()
    this.drawBackground()
    this.drawThrusties()
    this.drawShips()
  }

  erase() {
    this.draw(function(context, stage) {
      context.clearRect(0, 0, stage.width, stage.height)
    })
  }

  drawThrusties() {
    this.draw(context => {
      this.thrusties.forEach(({angle, x, y, mx, my, ttl}, index) => {
        this.thrusties[index].ttl -= 0.3
        this.thrusties[index].x += mx
        this.thrusties[index].y += my
        if (ttl > 0) {
          context.fillStyle = `rgba(225, 0, 0, ${ ttl })`
          this.drawTriangle(x, y, 10 * ttl, angle)
          context.fill()
        } else {
          this.thrusties.splice(index, 1)
        }
      })
    })
  }

  drawShips() {
    this.gameState.ships.forEach(ship => {
      this.draw(function(context) {

        if (ship.doge) {
          this.drawDoge(ship)
        } else {
          context.fillStyle = ship.colour
          this.drawTriangle(ship.x, ship.y, 30, ship.rotation)
          context.fill()
        }

        this.drawText(ship.name, ship.x, Math.max(ship.y - 25, 10), ship.colour)

        if (ship.thrusting) {
          const [mx, my] = this.rotatePoint(-ship.rotation, 0, 0)([0, 10])
          this.thrusties.push({
            angle: ship.rotation,
            x: ship.x + mx,
            y: ship.y + my,
            mx: mx,
            my: my,
            ttl: 1
          })
        }
      })
    })
  }

  drawDoge(ship) {
    this.drawImage(dogeImage, ship.x, ship.y, 96, 51, ship.rotation)
  }

  // Draw image whose center is x, y
  drawImage(image, x, y, width, height, rotation = 0) {
    this.draw(function(context) {
      context.translate(x, y)
      context.rotate(-rotation)
      context.drawImage(image, -width / 2, -height / 2, width, height)
    })
  }

  // Draw text whose center is at x
  drawText(text, x, y, colour) {
    this.draw(function(context) {
      let measurement = context.measureText(text)
      context.fillStyle = colour
      context.font = "bold 10pt Helvetica Neue"
      context.fillText(text, x - measurement.width / 2, y)
    })
  }

  drawBackground() {
    this.draw(function(context, stage) {
      context.fillStyle = 'white'
      context.fillRect(0, 0, stage.width, stage.height);
    })
  }

  rotatePoint(angle, x, y) {
    var cos = Math.cos(angle)
    var sin = Math.sin(angle)
    return ([px, py]) => [
      px * cos - py * sin + x,
      px * sin + py * cos + y
    ]
  }

  drawTriangle(x, y, size, rotation) {
    var path = [
      [0, -size / 2],
      [size / 2, size / 2],
      [-size / 2, size / 2]
    ].map(this.rotatePoint(-rotation, x, y))

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
