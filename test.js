const NativeTransport = require('./examples/native/transport')
const RAN = require('./')
const tape = require('tape')
const runtime = require('browser.runtime')

tape.test('Noop transport', function (t) {
  const ran = RAN('test')
  ran.open(t.end)
})

tape.test('browser.native', function (t) {
  const port = runtime.connectNative(`${__dirname}/examples/native/server.js`)
  const transport = new NativeTransport('test', port)
  const ran = RAN('test', transport)
  ran.open(function() {
    console.log('open')
    t.end()
    transport.close()
  })
})
