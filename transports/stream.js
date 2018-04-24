const NoopTransport = require('../transport')

function StreamTransport (name, stream) {
  NoopTransport.call(this, name)
  this._stream = stream
  this._stream.on('data', (data) => this._next(data))
}

StreamTransport.prototype = Object.create(NoopTransport.prototype)

StreamTransport.prototype.send = function (data) {
  this._stream.write(data)
}

StreamTransport.prototype.close = function () {
  this._sock.close()
}

module.exports = StreamTransport
