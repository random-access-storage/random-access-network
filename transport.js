const {Request, Callback} = require('./proto')

function NoopTransport (name) {
  this._callbacks = new Map()
  this._id = 0
  this._name = name
}

/**
 * Called with data to be sent
 * @param {Buffer} data
 */
NoopTransport.prototype.send = function (data) {
  this.onmessage(Callback.encode({id: this._id, error: null, name: this._name}))
}

/**
 * Called when a message is received
 * @param {any} data - you may need to transform it in a Buffer.
 *                     Once done, call `_next` with a Buffer
 *
 * Example:
 * this._next(Buffer.from(data.data))
 */
NoopTransport.prototype.onmessage = function (data) {
  this._next(data)
}

/**
 * Closes the transport
 */
NoopTransport.prototype.close = function () {}

NoopTransport.prototype._next = function (data) {
  data = Callback.decode(data)
  if (data.name !== this._name) {
    return
  }

  const request = this._callbacks.get(data.id)
  request.callback(data.error, data.stat ? data.stat : data.data)
}

NoopTransport.prototype._queue = function (request, origin) {
  const next = ++this._id
  request.name = this._name
  request.id = next
  this._callbacks.set(next, origin)
  this.send(Request.encode(request))
}

module.exports = NoopTransport
