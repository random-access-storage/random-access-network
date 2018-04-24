# Random Access Network
[![Build Status](https://travis-ci.org/soyuka/random-access-network.svg?branch=master)](https://travis-ci.org/soyuka/random-access-network)

A [Random Access Storage](https://github.com/random-access-storage) implementation that goes through a Transport.

## Installation

```
npm install random-access-network --save
```

## Usage

For example through WebSocket:

```
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

`random-access-network provides` a bridge utility to transform a request to a `random-access-storage` call:

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

A transport is a class that sends/receive data to/from an interface (network, IPC etc.).

```javascript
const NoopTransport = require('random-access-network/transport')

class MyTransport extends NoopTransport {
  constructor(name, interface) {
    super(name)
    this._interface = interface
    this._interface.on('message', (response) => this.onmessage(response))
  }

  /**
   * Send data to the interface
   */
  send(data) {
    this._interface.send(data)
  }

  /**
   * Receive data from the interface
   */
  onmessage(data) {
    this._next(data)
  }

  close() {
    this._interface.close()
  }
}

module.exports = MyTransport
```
