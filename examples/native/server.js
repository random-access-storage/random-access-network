#!/usr/bin/env node

/**
 * Implementing a native application that uses Native messaging protocol
 * and bridges a random-access-file storage
 * @see https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Native_messaging
 */
const {PassThrough} = require('stream')
const pump = require('pump')
const onmessage = new PassThrough()
const postMessage = new PassThrough()
const decode = require('browser.runtime/decoder')()
const encode = require('browser.runtime/encoder')()
const raf = require('random-access-file')
const {RasBridge} = require('../../')
const ras = RasBridge((name) => raf(name))

pump(process.stdin, decode, onmessage, function (err) {})
pump(postMessage, encode, process.stdout, function (err) {})

onmessage.on('data', function (d) {
  ras(Buffer.from(JSON.parse(d.toString()).data), function (callback) {
    postMessage.write(JSON.stringify(callback))
  })
})
