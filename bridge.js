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

function propagate(data, ras) {
  switch (data.action) {
    case Action.OPEN:
      ras._open(data)
      return
    case Action.OPENREADONLY:
      ras._openReadonly(data)
      return
    case Action.READ:
      ras._read(data)
      return
    case Action.WRITE:
      ras._write(data)
      return
    case Action.DEL:
      ras._del(data)
      return
    case Action.STAT:
      ras._stat(data)
      return
    case Action.CLOSE:
      ras._close(data)
      return
    case Action.DESTROY:
      ras._destroy(data)
      return
  }
}

module.exports = RasBridge
module.exports.propagate = propagate
