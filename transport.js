const EventEmitter = require('events')
const {Request, Callback} = require('./proto')

class NoopTransport extends EventEmitter {
  constructor(name) {
    super()
    this._callbacks = new Map()
    this._id = 0
    this._name = name
  }

  /**
   * Called with data to be sent
   * @param {Buffer} data
   */
  send(data) {
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
  onmessage(data) {
    this._next(data)
  }

  /**
   * Closes the transport
   */
  close() {}

  _next(data) {
    data = Callback.decode(data)
    if (data.name !== this._name) {
      return
    }

    const request = this._callbacks.get(data.id)
    request.callback.call(request, data.error, data.stat ? data.stat : data.data)
  }

  _queue(request, origin) {
    const next = ++this._id
    request.name = this._name
    request.id = next
    this._callbacks.set(next, origin)
    this.send(Request.encode(request))
  }
}

module.exports = NoopTransport
