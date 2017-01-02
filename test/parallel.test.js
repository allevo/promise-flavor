'use strict'

const test = require('blue-tape');
const parallel = require('../index').parallel
const utils = require('./test-utils')

const generatePromise = utils.generatePromise
const checkTimeNear = utils.checkTimeNear

test('parallel array should keep the order', t => {
  t.plan(1)

  return parallel([
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

test('parallel array should fail if one fails', t => {
  t.plan(1)

  return parallel([
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
        return generatePromise({delay: 100, result: undefined})
      },
      function() {
        return generatePromise({delay: 100, result: null})
      },
      function() {
        return generatePromise({delay: 100, result: false})
      },
    ])
    .then(() => {
      t.fail('The promise should fail')
    })
    .catch(e => {
      t.equal(e.message, 'DOOM', 'keep the same error')
    })
})

test('parallel array should run in parallel', t => {
  t.plan(2)

  const startTime = Date.now()
  return parallel([
      function() {
        return generatePromise({delay: 10, result: 2})
      },
      function() {
        return generatePromise({delay: 100, result: 1})
      },
      function() {
        return generatePromise({delay: 100, result: '3'})
      },
    ])
    .then(() => {
      checkTimeNear(t, startTime, 100)
    })
})

test('parallel array should work correctly with []', t => {
  return parallel([])
    .then(r => {
      t.deepEqual(r, [])
    })
})

test('parallel object should keep the same keys', t => {
  t.plan(1)

  return parallel({
      1: function() {
        return generatePromise({delay: 10, result: 2})
      },
      2: function() {
        return generatePromise({delay: 100, result: 1})
      },
      3: function() {
        return generatePromise({delay: 100, result: '3'})
      },
      4: function() {
        return generatePromise({delay: 100, result: {}})
      },
      5: function() {
        return generatePromise({delay: 100, result: undefined})
      },
      6: function() {
        return generatePromise({delay: 100, result: null})
      },
      7: function() {
        return generatePromise({delay: 100, result: false})
      },
    })
    .then(r => {
      t.deepEqual(r, {1: 2, 2: 1, 3: '3', 4: {}, 5: undefined, 6: null, 7: false})
    })
})

test('parallel object should fail if one fails', t => {
  t.plan(1)

  return parallel({
      1: function() {
        return generatePromise({delay: 10, result: 2})
      },
      2: function() {
        return generatePromise({delay: 100, result: 1})
      },
      3: function() {
        return generatePromise({delay: 100, result: '3'})
      },
      4: function() {
        return generatePromise({delay: 100, err: new Error('DOOM')})
      },
      5: function() {
        return generatePromise({delay: 100, result: undefined})
      },
      6: function() {
        return generatePromise({delay: 100, result: null})
      },
      7: function() {
        return generatePromise({delay: 100, result: false})
      },
    })
    .then(() => {
      t.fail('This test should fail')
    })
    .catch(e => {
      t.equal(e.message, 'DOOM', 'should keep the same error')
    })
})

test('parallel object should run in parallel', t => {
  t.plan(2)

  const startTime = Date.now()
  return parallel({
      1: function() {
        return generatePromise({delay: 10, result: 2})
      },
      2: function() {
        return generatePromise({delay: 100, result: 1})
      },
      3: function() {
        return generatePromise({delay: 100, result: '3'})
      },
    })
    .then(() => {
      checkTimeNear(t, startTime, 100)
    })
})

test('parallel object should work correctly with {}', t => {
  return parallel({})
    .then(r => {
      t.deepEqual(r, {})
    })
})
