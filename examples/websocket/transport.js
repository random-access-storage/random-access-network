const NoopTransport = require('../../transport')

class WssTransport extends NoopTransport {
  constructor(name, socket) {
    super(name)
    this._sock = socket
    this._sock.on('message', (response) => this._next(response))
  }

  send(data) {
    this._sock.send(data)
  }

  close() {
    this._sock.close()
  }
}

module.exports = WssTransport
