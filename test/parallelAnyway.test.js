'use strict'

const test = require('blue-tape')
const parallelAnyway = require('../index').parallelAnyway
const utils = require('./test-utils')

const generatePromise = utils.generatePromise
const checkTimeNear = utils.checkTimeNear

test('parallelAnyway array should work correctly', t => {
  return parallelAnyway([
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

test('parallelAnyway array should work in parallel', t => {
  const startTime = Date.now()
  return parallelAnyway([
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
      checkTimeNear(t, startTime, 100)
    })
})

test('parallelAnyway array should work correctly with []', t => {
  return parallelAnyway([])
    .then(r => {
      t.deepEqual(r.results, [])
      t.deepEqual(r.errors, [])
    })
})

test('parallelAnyway object should work correctly', t => {
  return parallelAnyway({
      foo: function() {
        return generatePromise({result: 1})
      },
      bar: function() {
        return generatePromise({result: '1'})
      },
      foobar: function() {
        return generatePromise({err: new Error('DOOM1')})
      },
      barfoo: function() {
        return generatePromise({result: true})
      },
      foofoo: function() {
        return generatePromise({err: new Error('DOOM2')})
      },
    })
    .then(r => {
      t.deepEqual(r.results, {
        foo: 1,
        bar: '1',
        barfoo: true,
      })
      t.equal(r.errors.foobar.message, 'DOOM1')
      t.equal(r.errors.foofoo.message, 'DOOM2')
    })
})

test('parallelAnyway object should work in parallel', t => {
  const startTime = Date.now()
  return parallelAnyway({
      foo: function() {
        return generatePromise({result: 1, delay: 100})
      },
      bar: function() {
        return generatePromise({result: '1', delay: 100})
      },
      foobar: function() {
        return generatePromise({err: new Error('DOOM1'), delay: 100})
      },
      barfoo: function() {
        return generatePromise({result: true, delay: 100})
      },
      foofoo: function() {
        return generatePromise({err: new Error('DOOM2'), delay: 100})
      },
    })
    .then(() => {
      checkTimeNear(t, startTime, 100)
    })
})

test('parallelAnyway object should work correctly with {}', t => {
  return parallelAnyway({})
    .then(r => {
      t.deepEqual(r.results, {})
      t.deepEqual(r.errors, {})
    })
})

