'use strict'

const test = require('blue-tape')
const filter = require('../index').filter
const utils = require('./test-utils')

const generatePromise = utils.generatePromise
const checkTimeNear = utils.checkTimeNear

test('filter array should work correctly', t => {
  return filter([1, 2, 3, 4, 5, 6], i => generatePromise({result: i % 2 === 0}))
    .then(r => {
      t.deepEqual(r, [2, 4, 6], 'should keep only the odd values')
    })
})

test('filter array should work in parallel', t => {
  const startTime = Date.now()
  return filter([1, 2, 3, 4, 5, 6], i => generatePromise({result: i % 2 === 0, delay: 100}))
    .then(() => {
      checkTimeNear(t, startTime, 100)
    })
})

test('filter array should fail if one fails', t => {
  return filter([1, 2, 3, 4, 5, 6], i => {
      if (i === 4) return generatePromise({err: new Error('DOOM')})
      return generatePromise({result: i % 2 === 0, delay: 100})
    })
    .then(() => {
      t.fail('This test should fail')
    })
    .catch(e => {
      t.equal(e.message, 'DOOM', 'should keep the same error')
    })
})

test('filter array should work correctly with []', t => {
  return filter([], () => t.fail('This function should never be called'))
    .then(r => {
      t.deepEqual(r, [])
    })
})

test('filter object should work correctly', t => {
  return filter({1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6}, i => generatePromise({result: i % 2 === 0}))
    .then(r => {
      t.deepEqual(r, {2: 2, 4: 4, 6: 6}, 'should keep only the odd values')
    })
})

test('filter object should fail if one fails', t => {
  return filter({1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6}, i => {
      if (i === 4) return generatePromise({err: new Error('DOOM')})
      return generatePromise({result: i % 2 === 0, delay: 100})
    })
    .then(() => {
      t.fail('This test should fail')
    })
    .catch(e => {
      t.equal(e.message, 'DOOM', 'should keep the same error')
    })
})

test('filter object should work in parallel', t => {
  const startTime = Date.now()
  return filter({1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6}, i => generatePromise({result: i % 2 === 0, delay: 100}))
    .then(() => {
      checkTimeNear(t, startTime, 100)
    })
})

test('filter object should work correctly with {}', t => {
  return filter({}, () => t.fail('This function should never be called'))
    .then(r => {
      t.deepEqual(r, {})
    })
})
