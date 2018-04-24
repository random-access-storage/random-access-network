const ras = require('random-access-storage')
const {Action} = require('./proto')
const NoopTransport = require('./transport')
const empty = Buffer.alloc(0)

function RAN (name, transport) {
  transport = transport || new NoopTransport(name)

  function send (action, req) {
    const request = {
      action: action,
      size: req.size || 0,
      offset: req.offset || 0
    }

    if (action === Action.WRITE) {
      request.data = req.data || empty
    }

    transport._queue(request, req)
  }

  return ras({
    open: (req) => send(Action.OPEN, req),
    read: (req) => send(Action.READ, req),
    openReadonly: (req) => send(Action.OPENREADONLY, req),
    write: (req) => send(Action.WRITE, req),
    del: (req) => send(Action.DEL, req),
    stat: (req) => send(Action.STAT, req),
    close: (req) => send(Action.CLOSE, req),
    destroy: (req) => send(Action.DESTROY, req)
  })
}

module.exports = RAN
module.exports.RAN = RAN
module.exports.NoopTransport = NoopTransport
module.exports.StreamTransport = require('./transports/stream')
module.exports.RasBridge = require('./bridge')
