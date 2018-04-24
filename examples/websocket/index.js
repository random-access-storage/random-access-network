const WebSocket = require('ws')
const RAN = require('../../')
const WssTransport = require('./transport')

const sock = new WebSocket('ws://localhost:8080')
const transport = new WssTransport('test', sock)
const file = RAN('test', transport)

sock.on('open', function() {
  file.write(0, Buffer.from('hello'), function (err) {
    file.read(0, 5, function (err, buffer) {
      console.log(buffer.toString())
      file.close(function() {
        console.log('file closed')
        transport.close()
      })
    })
  })
})
