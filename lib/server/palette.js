export default class Palette {
  constructor(colours) {
    this.colours = colours
  }

  nextColour() {
    let colour = this.colours.shift()
    this.colours.push(colour)
    return colour
  }
}
