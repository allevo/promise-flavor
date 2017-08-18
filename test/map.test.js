'use strict'

const test = require('blue-tape')
const map = require('../index').map
const utils = require('./test-utils')

const generatePromise = utils.generatePromise
const checkTimeNear = utils.checkTimeNear

test('map array should keep the order', t => {
  return map([1, 2, 3, 4, 5, 6], i => generatePromise({result: i*i}))
    .then(r => {
      t.deepEqual(r, [1, 4, 9, 16, 25, 36], 'should keep the same order')
    })
})

test('map array should fail if one fails', t => {
  return map([1, 2, 3, 4, 5, 6], i => {
      if (i === 3) return generatePromise({err: new Error('DOOM')})
      return generatePromise({result: i*i})
    })
    .then(() => {
      t.fail('this test should fail')
    })
    .catch(e => {
      t.equal('DOOM', e.message, 'should keep the error')
    })
})

test('map array should work in parallel', t => {
  const startTime = Date.now()
  return map([1, 2, 3, 4, 5, 6], i => generatePromise({result: i*i, delay: 100}))
    .then(() => {
      checkTimeNear(t, startTime, 100)
    })
})

test('map array should work correctly with []', t => {
  return map([], () => t.fail('This function should not be called'))
    .then(r => {
      t.deepEqual(r, [])
    })
})

test('map array should receive the key too', t => {
  return map([1, 2, 3, 4, 5, 6], (i, k) => generatePromise({result: i*k}))
    .then(r => {
      t.deepEqual(r, [ 0, 2, 6, 12, 20, 30 ], 'should have the key')
    })
})

test('map object should keep the keys', t => {
  return map({1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6}, i => generatePromise({result: i*i}))
    .then(r => {
      t.deepEqual(r, {1: 1, 2: 4, 3: 9, 4: 16, 5: 25, 6: 36}, 'should keep the same keys')
    })
})

test('map object should fail if one fails', t => {
  return map({1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6}, i => {
      if (i === 3) return generatePromise({err: new Error('DOOM')})
      return generatePromise({result: i*i})
    })
    .then(() => {
      t.fail('this test should fail')
    })
    .catch(e => {
      t.equal('DOOM', e.message, 'should keep the error')
    })
})

test('map object should work in parallel', t => {
  const startTime = Date.now()
  return map({1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6}, i => generatePromise({result: i*i, delay: 100}))
    .then(() => {
      checkTimeNear(t, startTime, 100)
    })
})

test('map object should work correctly with {}', t => {
  return map({}, () => t.fail('This function should not be called'))
    .then(r => {
      t.deepEqual(r, {})
    })
})

test('map object should receive the key too', t => {
  return map({1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6}, (i, k) => generatePromise({result: i*k}))
    .then(r => {
      t.deepEqual(r, {1: 1, 2: 4, 3: 9, 4: 16, 5: 25, 6: 36}, 'should have the key')
    })
})
