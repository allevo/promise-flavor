'use strict'

const test = require('blue-tape')
const mapAnyway = require('../index').mapAnyway
const utils = require('./test-utils')

const generatePromise = utils.generatePromise
const checkTimeNear = utils.checkTimeNear

test('mapAnyway array should work correctly', t => {
  return mapAnyway([1, 2, 3, 4, 5, 6], i => {
      if (i === 2 || i === 5) return generatePromise({err: new Error('DOOM' + i)})
      return generatePromise({result: i * i})
    })
    .then(r => {
      t.deepEqual(r.results, [1, undefined, 9, 16, undefined, 36])
      t.equal(r.errors[0], undefined)
      t.equal(r.errors[1].message, 'DOOM2')
      t.equal(r.errors[2], undefined)
      t.equal(r.errors[3], undefined)
      t.equal(r.errors[4].message, 'DOOM5')
      t.equal(r.errors[5], undefined)
    })
})

test('mapAnyway array should work in parallel', t => {
  const startTime = Date.now()
  return mapAnyway([1, 2, 3, 4, 5, 6], i => {
      if (i === 2 || i === 5) return generatePromise({err: new Error('DOOM' + i), delay: 100})
      return generatePromise({result: i * i, delay: 100})
    })
    .then(() => {
      checkTimeNear(t, startTime, 100)
    })
})

test('mapAnyway array should work correctly with []', t => {
  return mapAnyway([], () => t.fail('should never be called'))
    .then(r => {
      t.deepEqual(r.results, [])
      t.deepEqual(r.errors, [])
    })
})

test('mapAnyway array should receive the key too', t => {
  return mapAnyway([1, 2, 3, 4, 5, 6], (i, k) => generatePromise({result: i*k}))
    .then(r => {
      t.deepEqual(r.results, [ 0, 2, 6, 12, 20, 30 ], 'should have the key')
    })
})

test('mapAnyway object should work correctly', t => {
  return mapAnyway({1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6}, i => {
      if (i === 2 || i === 5) return generatePromise({err: new Error('DOOM' + i)})
      return generatePromise({result: i * i})
    })
    .then(r => {
      t.deepEqual(r.results, {1: 1, 3: 9, 4: 16, 6: 36}, 'should keep the same keys')
      t.equal(r.errors[2].message, 'DOOM2')
      t.equal(r.errors[5].message, 'DOOM5')
    })
})

test('mapAnyway object should work in parallel', t => {
  const startTime = Date.now()
  return mapAnyway({1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6}, i => {
      if (i === 2 || i === 5) return generatePromise({err: new Error('DOOM' + i), delay: 100})
      return generatePromise({result: i * i, delay: 100})
    })
    .then(() => {
      checkTimeNear(t, startTime, 100)
    })
})

test('mapAnyway object should work correctly with {}', t => {
  return mapAnyway({}, () => { t.fail('should never be called') })
    .then(r => {
      t.deepEqual(r.results, {})
      t.deepEqual(r.errors, {})
    })
})

test('mapAnyway object should receive the key too', t => {
  return mapAnyway({1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6}, (i, k) => generatePromise({result: i*k}))
    .then(r => {
      t.deepEqual(r.results, {1: 1, 2: 4, 3: 9, 4: 16, 5: 25, 6: 36}, 'should have the key')
    })
})
