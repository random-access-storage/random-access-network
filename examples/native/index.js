// nodejs polyfil
const runtime = require('browser.runtime')

const RAN = require('../../')
const NativeTransport = require('./transport')

// On a browser it'd be runtime.connectNative(applicationId)
const port = runtime.connectNative(`${__dirname}/server.js`)
const transport = new NativeTransport('test', port)
const file = RAN('test', transport)

file.write(0, Buffer.from('hello'), function (err) {
  file.read(0, 5, function (err, buffer) {
    console.log(buffer.toString())
    file.close(function() {
      console.log('file closed')
      transport.close()
    })
  })
})
