## Native messaging example

An example that works through the WebExtensions Native Messaging API.

Here'd be the browser code:

```javascript
const {NoopTransport, RAN} = require('random-access-network')

function NativeTransport (name, port) {
  NoopTransport.call(this, name)
  this._port = port
  this._port.onMessage.addListener((response) => this.onmessage(response))
}

NativeTransport.prototype = Object.create(NoopTransport.prototype)

NativeTransport.prototype.send = function (data) {
  this._port.postMessage(data)
}

NativeTransport.prototype.onmessage = function (data) {
  this._next(Buffer.from(data.data))
}

NativeTransport.prototype.close = function () {
  this._port.disconnect()
}

const port = runtime.connectNative('native-server')
const transport = new NativeTransport('test', port)
const ran = RAN('test', transport)
ran.open(function() {
  // do something
})
```

The native application:

```javascript
#!/usr/bin/env node

const {PassThrough} = require('stream')
const pump = require('pump')
const decoder = require('browser.runtime/decoder')
const encoder = require('browser.runtime/encoder')
const raf = require('random-access-file')

// Bridge
const {RasBridge} = require('random-access-network')
const ras = RasBridge((name) => raf(name))

const onmessage = new PassThrough()
const postMessage = new PassThrough()

pump(process.stdin, decoder(), onmessage, function (err) {})
pump(postMessage, encoder(), process.stdout, function (err) {})

onmessage.on('data', function (d) {
  ras(Buffer.from(JSON.parse(d.toString()).data), function (callback) {
    postMessage.write(JSON.stringify(callback))
  })
})
```

See also:
- https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Native_messaging
- https://github.com/soyuka/browser.runtime (runtime polyfil for nodejs)
