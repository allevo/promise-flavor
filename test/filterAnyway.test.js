'use strict'

const test = require('blue-tape')
const filterAnyway = require('../index').filterAnyway
const utils = require('./test-utils')

const generatePromise = utils.generatePromise
const checkTimeNear = utils.checkTimeNear

test('filterAnyway array should work correctly', t => {
  return filterAnyway([1, 2, 3, 4, 5, 6], i => generatePromise({result: i % 2 === 0}))
    .then(r => {
      t.deepEqual(r.results, [2, 4, 6], 'should keep only the odd values')
      t.deepEqual(r.errors, [undefined, undefined, undefined, undefined, undefined, undefined])
    })
})

test('filterAnyway array should work in parallel', t => {
  const startTime = Date.now()
  return filterAnyway([1, 2, 3, 4, 5, 6], i => generatePromise({result: i % 2 === 0, delay: 100}))
    .then(() => {
      checkTimeNear(t, startTime, 100)
    })
})

test('filterAnyway array should work correctly with []', t => {
  return filterAnyway([], () => t.fail('This function should never be called'))
    .then(r => {
      t.deepEqual(r.results, [])
      t.deepEqual(r.errors, [])
    })
})

test('filterAnyway array should go on if one fails', t => {
  return filterAnyway([1, 2, 3, 4, 5, 6], i => {
      if (i === 2 || i === 5) return generatePromise({err: new Error('DOOM')})
      return generatePromise({result: i % 2 === 0, delay: 100})
    })
    .then(r => {
      t.deepEqual(r.results, [4, 6], 'should keep only the odd values')
      t.deepEqual(r.errors[0], undefined)
      t.deepEqual(r.errors[1].message, 'DOOM')
      t.deepEqual(r.errors[2], undefined)
      t.deepEqual(r.errors[3], undefined)
      t.deepEqual(r.errors[4].message, 'DOOM')
      t.deepEqual(r.errors[5], undefined)
    })
})

test('filterAnyway array should receive the key too', t => {
  return filterAnyway([1, 2, 3, 4, 5, 6], (i, k) => generatePromise({result: i % 2 === 0 && k % 2 === 1}))
    .then(r => {
      t.deepEqual(r.results, [ 2, 4, 6 ], 'should have the key')
    })
})

test('filterAnyway object should work correctly', t => {
  return filterAnyway({1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6}, i => generatePromise({result: i % 2 === 0}))
    .then(r => {
      t.deepEqual(r.results, {2: 2, 4: 4, 6: 6}, 'should keep only the odd values')
      t.deepEqual(r.errors, {})
    })
})

test('filterAnyway object should work in parallel', t => {
  const startTime = Date.now()
  return filterAnyway({1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6}, i => generatePromise({result: i % 2 === 0, delay: 100}))
    .then(() => {
      checkTimeNear(t, startTime, 100)
    })
})

test('filterAnyway object should work correctly with {}', t => {
  return filterAnyway({}, () => t.fail('This function should never be called'))
    .then(r => {
      t.deepEqual(r.results, {})
      t.deepEqual(r.errors, {})
    })
})

test('filterAnyway object should go on if one fails', t => {
  return filterAnyway({1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6}, i => {
      if (i === 2 || i === 5) return generatePromise({err: new Error('DOOM')})
      return generatePromise({result: i % 2 === 0, delay: 100})
    })
    .then(r => {
      t.deepEqual(r.results, {4: 4, 6: 6}, 'should keep only the odd values')
      t.deepEqual(r.errors[1], undefined)
      t.deepEqual(r.errors[2].message, 'DOOM')
      t.deepEqual(r.errors[3], undefined)
      t.deepEqual(r.errors[4], undefined)
      t.deepEqual(r.errors[5].message, 'DOOM')
      t.deepEqual(r.errors[6], undefined)
    })
})

test('filterAnyway object should receive the key too', t => {
  return filterAnyway({1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6}, (i, k) => generatePromise({result: i % 2 === 0 && k % 2 === 0}))
    .then(r => {
      t.deepEqual(r.results, { 2: 2, 4: 4, 6: 6 }, 'should have the key')
    })
})
