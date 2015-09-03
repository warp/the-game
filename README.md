# The Game

## Set-up

Install dependencies:

    npm install

Start a watcher:

    npm run dev

Start the server
  
    npm start

Open `http://localhost:8080`


## Messaging Spec
`in flux`

The client may send any of the following events:

1. `join` with an optional `{ name: '<name-of-player>'}` payload
2. `inputState` with a `{ <action>: <true|false>, ... }` payload
3. `leave`

The server must periodically broadcast a `state` event with the following payload:

```
{
  ships: [
    { x: <float>, y: <float>, rotation: <radians>, name: <string>, ... },
    ...
  ]
}
```
