## Websocket raf

```javascript
const NoopTransport = require('random-access-network/transport')
const RAN = require('random-access-network')

class WssTransport extends NoopTransport {
  constructor(name, socket) {
    super(name)
    this._sock = socket
    this._sock.on('message', (response) => this.onmessage(response))
  }

  send(data) {
    this._sock.send(data)
  }

  onmessage(data) {
    this._next(data)
  }

  close() {
    this._sock.close()
  }
}

const sock = new WebSocket('ws://localhost:8080')
const transport = new WssTransport('test', sock)
const file = RAN('test', transport)

sock.on('open', function() {
  file.write(0, Buffer.from('hello'), function (err) {
    file.read(0, 5, function (err, buffer) {
      console.log(buffer.toString())
      file.close(function() {
        console.log('file closed')
        transport.close()
      })
    })
  })
})
```

The websocket server (bridges `random-access-file`):

```javascript
const WebSocket = require('ws')
const raf = require('random-access-file')
const ras = require('random-access-network/rasb')((name) => raf(name))

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    ras(message, function (callback) {
      ws.send(callback)
    })
  })
})
```
