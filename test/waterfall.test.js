'use strict'

const test = require('blue-tape');
const waterfall = require('../index').waterfall
const utils = require('./test-utils')

const generatePromise = utils.generatePromise

test('waterfall array should keep the last result', t => {
  t.plan(7)

  return waterfall([
      function(arg) {
        t.equal(arg, undefined, 'first one should be undefined')
        return generatePromise({result: 3})
      },
      function(arg) {
        t.equal(arg, 3, 'can pass integer')
        return generatePromise({result: '3'})
      },
      function(arg) {
        t.equal(arg, '3', 'can pass string')
        return generatePromise({result: true})
      },
      function(arg) {
        t.equal(arg, true, 'can pass boolean')
        return generatePromise({result: {}})
      },
      function(arg) {
        t.deepEqual(arg, {}, 'can pass object')
        return generatePromise({result: undefined})
      },
      function(arg) {
        t.equal(arg, undefined, 'can pass undefined')
        return generatePromise({result: null})
      },
    ])
    .then(r => {
      t.equal(r, null, 'can pass null')
    })
})

test('waterfall array should fail if one fails', t => {
  t.plan(1)

  return waterfall([
      function() {
        return generatePromise({result: 3})
      },
      function() {
        return generatePromise({err: new Error('DOOM')})
      },
      function() {
        t.fail('This test should stop before')
      },
    ])
    .then(() => {
      t.fail('This test should fail')
    })
    .catch(e => {
      t.equal(e.message, 'DOOM', 'This test should keep the error')
    }) 
})

test('waterfall array should work correctly with []', t => {
  return waterfall([])
    .then(r => {
      t.deepEqual(r, undefined)
    }) 
})
