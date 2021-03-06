import InputListener from './input-listener'
import Rendering from './rendering'
import Stage from './stage'

window.Client = class Client {
  constructor(name) {
    this.name = name
  }

  start() {
    let stage = new Stage(1000, 600)
    let input = new InputListener()
    let client = new WebSocket(document.location.protocol.replace('http', 'ws') + '//' + document.location.host)
    let thrusties = []

    window.addEventListener('beforeunload', function() {
      client.close()
    })

    client.onopen = function() {
      client.send(JSON.stringify({ join: { name: this.name } }))

      input.events.on('stateChange', function(state) {
        client.send(JSON.stringify({ inputState: state }))
      })
    }.bind(this)

    client.onmessage = function(message) {
      let gameState = JSON.parse(message.data).state
      new Rendering(stage, gameState, thrusties).perform()
    }
  }

  static start(...params){
    let client = new Client(...params)
    client.start()
  }
}
