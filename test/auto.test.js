'use strict'

const test = require('blue-tape')
const auto = require('../index').auto
const utils = require('./test-utils')

const generatePromise = utils.generatePromise

test('auto should work well', t => {
  return auto({
      foo: function() {
        return generatePromise({result: 2})
      },
      bar: function() {
        return generatePromise({result: 3})
      },
      foobar: ['foo', 'bar', function(r) {
        return generatePromise({result: r.foo + r.bar})
      }],
      barfoo: ['foo', 'bar', function(r) {
        return generatePromise({result: r.foo * r.bar})
      }],
    })
    .then(r => {
      t.deepEqual(r, { foo: 2, bar: 3, foobar: 5, barfoo: 6 }, 'should work well')
    })
})

test('auto should work well with many tasks', t => {
  const tree = {}
  const allDeps = []
  for(let i = 1; i < 100; i++) {
    tree['task_simple_' + i] = function() { return generatePromise({result: i})}
    if (i % 10 === 0) {
      const deps = []
      for (let j = i - 9; j<i; j++) {
        deps.push('task_simple_' + j)
      }
      deps.push(function(r) {
        return generatePromise({result: Object.keys(r).reduce((s, el) => { s+= r[el]; return s}, 0)})
      })
      tree['task_group10_' + i] = deps
      allDeps.push('task_group10_' + i)
    }
  }
  allDeps.push((r) => {
    return generatePromise({
      result: r['task_group10_10'] +
        r['task_group10_20'] +
        r['task_group10_30'] +
        r['task_group10_40'] +
        r['task_group10_50'] +
        r['task_group10_60'] +
        r['task_group10_70'] +
        r['task_group10_80'] +
        r['task_group10_90'],
      })
  })
  
  tree.all = allDeps

  return auto(tree)
    .then(r => {
      t.equal(r.all, 44550)
    })
})

test('auto should fail if the tree is not resoleable', t => {
  return auto({
      task1: function() {
        return generatePromise({result: 1})
      },
      task2: ['task1', 'unknown_task', function() {
        return t.fail('this test should not continue')
      }],
    })
    .then(() => {
      t.fail('this test should fail')
    })
    .catch(e => {
      t.equal('Tree cannot be resolved', e.message)
    })
})

test('auto should fail if the tree is malformed', t => {
  return auto({
      task1: function() {
        return generatePromise({result: 1})
      },
      task2: {},
    })
    .then(() => {
      t.fail('this test should fail')
    })
    .catch(e => {
      t.equal('Tree is malformed', e.message)
    })
})

test('auto should work correctly with {}', t => {
  return auto({})
    .then(r => {
      t.deepEqual(r, {})
    })
})
