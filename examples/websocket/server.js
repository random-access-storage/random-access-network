#!/usr/bin/env node

const WebSocket = require('ws')
const raf = require('random-access-file')
const ras = require('../../bridge')((name) => raf(name))

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    ras(message, function (callback) {
      ws.send(callback)
    })
  })
})
