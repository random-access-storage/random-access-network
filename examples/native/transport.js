const NoopTransport = require('../../transport')

class NativeTransport extends NoopTransport {
  constructor(name, port) {
    super(name)
    this._port = port
    this._port.onMessage.addListener((response) => this.onmessage(response))
  }

  send(data) {
    this._port.postMessage(data)
  }

  onmessage(data) {
    this._next(Buffer.from(data.data))
  }

  close() {
    this._port.disconnect()
  }
}

module.exports = NativeTransport
