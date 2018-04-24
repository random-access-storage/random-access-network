const NoopTransport = require('../../transport')

function NativeTransport (name, port) {
  NoopTransport.call(this, name)
  this._port = port
  this._port.onMessage.addListener((response) => this.onmessage(response))
}

NativeTransport.prototype = Object.create(NoopTransport.prototype)

NativeTransport.prototype.send = function (data) {
  this._port.postMessage(data)
}

NativeTransport.prototype.onmessage = function (data) {
  this._next(Buffer.from(data.data))
}

NativeTransport.prototype.close = function () {
  this._port.disconnect()
}

module.exports = NativeTransport
