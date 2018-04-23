## Native messaging example

An example that works through the WebExtensions Native Messaging API.

Here'd be the browser code:

```javascript
const NoopTransport = require('random-access-network/transport')

class NativeTransport extends NoopTransport {
  constructor(name, port) {
    super(name)
    this._port = port
    this._port.onMessage.addListener((response) => this.onmessage(response))
  }

  send(data) {
    this._port.postMessage(data)
  }

  onmessage(data) {
    this._next(Buffer.from(data.data))
  }

  close() {
    this._port.disconnect()
  }
}

const RAN = require('random-access-network')
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
const ras = require('random-access-network/rasb')((name) => raf(name))

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
