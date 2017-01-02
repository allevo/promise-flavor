'use strict'

const test = require('blue-tape');
const serie = require('../index').serie
const utils = require('./test-utils')

const generatePromise = utils.generatePromise
const checkTimeNear = utils.checkTimeNear

test('serie array should keep the order', t => {
  t.plan(1)

  return serie([
      function() {
        return generatePromise({delay: 10, result: 2})
      },
      function() {
        return generatePromise({delay: 100, result: 1})
      },
      function() {
        return generatePromise({delay: 100, result: '3'})
      },
      function() {
        return generatePromise({delay: 100, result: {}})
      },
      function() {
        return generatePromise({delay: 100, result: undefined})
      },
      function() {
        return generatePromise({delay: 100, result: null})
      },
      function() {
        return generatePromise({delay: 100, result: false})
      },
    ])
    .then(r => {
      t.deepEqual(r, [2, 1, '3', {}, undefined, null, false], 'Wrong order')
    })
})

test('serie array should fail if one fails', t => {
  t.plan(1)

  return serie([
      function() {
        return generatePromise({delay: 10, result: 2})
      },
      function() {
        return generatePromise({delay: 100, result: 1})
      },
      function() {
        return generatePromise({delay: 100, result: '3'})
      },
      function() {
        return generatePromise({delay: 100, err: new Error('DOOM')})
      },
      function() {
        t.fail('The test should stop after the error')
      },
      
    ])
    .then(() => {
      t.fail('This test should fail')
    })
    .catch(e => {
      t.equal(e.message, 'DOOM', 'should keep the same error')
    })
})

test('serie array should work in series', t => {
  t.plan(2)

  const startTime = Date.now()
  return serie([
      function() {
        return generatePromise({delay: 10, result: 2})
      },
      function() {
        return generatePromise({delay: 100, result: 1})
      },
      function() {
        return generatePromise({delay: 100, result: '3'})
      },
      function() {
        return generatePromise({delay: 100, result: {}})
      },
    ])
    .then(() => {
      checkTimeNear(t, startTime, 310)
    })
})

test('serie array should work correctly with []', t => {
  return serie([])
    .then(r => {
      t.deepEqual(r, [])
    })
})
