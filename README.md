# Random Access Network
[![Build Status](https://travis-ci.org/random-access-storage/random-access-network.svg?branch=master)](https://travis-ci.org/random-access-storage/random-access-network)

A [Random Access Storage](https://github.com/random-access-storage) implementation that goes through a Transport.

## Installation

```code
npm install random-access-network --save
```

## Usage

For example through WebSocket:

```javascript
const WebSocket = require('ws')
const RAN = require('random-acces-network')
// see below
const WssTransport = require('./transport')

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

### Bridge

`random-access-network` provides a bridge utility to transform a request to a `random-access-storage` call:

```javascript
const rasb = require('random-access-network/bridge')(function getRas(name) {
  return raf(name)
})
```

Usage example in the websocket case:

```javascript
const WebSocket = require('ws')
const raf = require('random-access-file')
const ras = require('random-access-network/bridge')((name) => raf(name))

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    ras(message, function (callback) {
      ws.send(callback)
    })
  })
})

```

### Transport

A transport is a class that sends/receive data to/from an interface (network, IPC etc.) and handles encoding/decoding.

The `NoopTransport` handles the correct propagation of request/callbacks. When creating your own transport you should implement the methods `send`, `onmessage` and optionally `close`:
- `send` gets a buffer to be send to the network of your choice
- `onmessage` should call `this._next(buffer)` once you've transformed the received data in a buffer
- `close` if you want to close the network interface

For example a websocket transport:

```javascript
const NoopTransport = require('random-access-network/transport')

function WssTransport (name, socket) {
  NoopTransport.call(this, name)
  this._sock = socket
  this._sock.on('message', (response) => this.onmessage(response))
}

WssTransport.prototype = Object.create(NoopTransport.prototype)

WssTransport.prototype.send = function (data) {
  this._sock.send(data)
}

WssTransport.prototype.onmessage = function (data) {
  this._next(data)
}

WssTransport.prototype.close = function () {
  this._sock.close()
}
```

See also the [native messaging implementation](./example/native).
