const NoopTransport = require('../../transport')

function WssTransport (name, socket) {
  NoopTransport.call(this, name)
  this._sock = socket
  this._sock.on('message', (response) => this._next(response))
}

WssTransport.prototype = Object.create(NoopTransport.prototype)

WssTransport.prototype.send = function (data) {
  this._sock.send(data)
}

WssTransport.prototype.close = function () {
  this._sock.close()
}

module.exports = WssTransport
