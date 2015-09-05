export default class Stage {
  constructor(width, height) {
    this.materialize()
    this.width = width
    this.height = height
  }

  materialize() {
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')
    document.body.appendChild(this.canvas)
  }

  set width(value) {
    this.canvas.width = value
  }

  get width() {
    return this.canvas.width
  }

  set height(value) {
    this.canvas.height = value
  }

  get height() {
    return this.canvas.height
  }
}
