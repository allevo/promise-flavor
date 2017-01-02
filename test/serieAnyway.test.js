'use strict'

const test = require('blue-tape')
const serieAnyway = require('../index').serieAnyway
const utils = require('./test-utils')

const generatePromise = utils.generatePromise
const checkTimeNear = utils.checkTimeNear

test('serieAnyway should work correctly', t => {
  return serieAnyway([
      function() {
        return generatePromise({result: 1})
      },
      function() {
        return generatePromise({result: '1'})
      },
      function() {
        return generatePromise({err: new Error('DOOM')})
      },
      function() {
        return generatePromise({result: true})
      },
      function() {
        return generatePromise({err: new Error('DOOM')})
      },
    ])
    .then(r => {
      t.deepEqual(r.results, [1, '1', undefined, true, undefined])
      t.equal(r.errors[0], undefined)
      t.equal(r.errors[1], undefined)
      t.equal(r.errors[2].message, 'DOOM')
      t.equal(r.errors[3], undefined)
      t.equal(r.errors[4].message, 'DOOM')
    })
})

test('serieAnyway should work in series', t => {
  const startTime = Date.now()

  return serieAnyway([
      function() {
        return generatePromise({result: 1, delay: 100})
      },
      function() {
        return generatePromise({result: '1', delay: 100})
      },
      function() {
        return generatePromise({err: new Error('DOOM'), delay: 100})
      },
      function() {
        return generatePromise({result: true, delay: 100})
      },
      function() {
        return generatePromise({err: new Error('DOOM'), delay: 100})
      },
    ])
    .then(() => {
      checkTimeNear(t, startTime, 500)
    })
})

test('serieAnyway should work with 0 tasks', t => {
  return serieAnyway([])
    .then(r => {
      t.deepEqual(r, {results: [], errors: []})
    })
})
