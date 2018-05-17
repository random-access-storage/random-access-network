const raf = require('random-access-file')
const {Request, Callback, Action} = require('./proto')
const rafMap = new Map()

function RasBridge (getRas) {
  return function (data, cb) {
    data = Request.decode(data)

    if (!rafMap.has(data.name)) {
      rafMap.set(data.name, getRas(data.name))
    }

    const current = rafMap.get(data.name)

    data.callback = function (error, arg) {
      const response = {id: data.id, error: error, name: data.name, stat: null, data: null}

      if (arg !== undefined) {
        if (Buffer.isBuffer(arg)) response.data = arg
        else response.stat = arg
      }

      cb(Callback.encode(response))
    }

    propagate(data, current)
  }
}

function propagate (request, ras) {
  switch (request.action) {
    case Action.OPEN:
      ras.open(request.callback)
      return
    case Action.OPENREADONLY:
      ras.open(request.callback)
      return
    case Action.READ:
      ras.read(request.offset, request.size, request.callback)
      return
    case Action.WRITE:
      ras.write(request.offset, request.data, request.callback)
      return
    case Action.DEL:
      ras.del(request.offset, request.size, request.callback)
      return
    case Action.STAT:
      ras.stat(request.callback)
      return
    case Action.CLOSE:
      ras.close(request.callback)
      return
    case Action.DESTROY:
      ras.destroy(request.callback)
  }
}

module.exports = RasBridge
module.exports.propagate = propagate
