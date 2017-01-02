'use strict'

const test = require('blue-tape')
const retry = require('../index').retry
const utils = require('./test-utils')

const generatePromise = utils.generatePromise
const checkTimeNear = utils.checkTimeNear

test('retry ok', t => {
  return retry(() => generatePromise({result: 1}))
    .then(r => {
      t.equal(r, 1)
    })
})

test('retry fail', t => {
  let count = 0
  return retry(() => {
      count ++
      return generatePromise({err: new Error('DOOM')})
    })
    .then(() => {
      t.fail('This test should fails')
    })
    .catch(e => {
      t.equal(e.message, 'DOOM')
      t.equal(count, 3)
    })
})

test('retry should call DEFAULT_TIMES', t => {
  let count = 0
  return retry(() => {
      count++
      if (count >= 3) return generatePromise({result: 2})
      return generatePromise({err: new Error('DOOM')})
    })
    .then(r => {
      t.equal(r, 2)
      t.equal(count, 3)
    })
})

test('retry should call {times: 5}', t => {
  let count = 0
  return retry(() => {
      count++
      if (count >= 5) return generatePromise({result: 2})
      return generatePromise({err: new Error('DOOM')})
    }, {times: 5})
    .then(r => {
      t.equal(r, 2)
      t.equal(count, 5)
    })
})

test('retry with delay', t => {
  const startTime = Date.now()
  let count = 0
  return retry(() => {
      count++
      if (count >= 3) return generatePromise({result: 2})
      return generatePromise({err: new Error('DOOM')})
    }, {delay: 100})
    .then(() => {
      checkTimeNear(t, startTime, 200)
    })
})

test('retry with invalid times', t => {
  return retry(() => t.fail('This function should never be called'), {times: -1})
    .then(() => {
      t.fail('This test should fails')
    })
    .catch(e => {
      t.equal(e.message, 'Invalid options: times')
    })
})

test('retry with invalid delay', t => {
  return retry(() => t.fail('This function should never be called'), {delay: -1})
    .then(() => {
      t.fail('This test should fails')
    })
    .catch(e => {
      t.equal(e.message, 'Invalid options: delay')
    })
})

test('retry with linear delay', t => {
  const startTime = Date.now()
  return retry(() => generatePromise({err: new Error('DOOM')}), {delay: 100, delayType: retry.DELAY_TYPES.LINEAR})
    .catch(() => {
      checkTimeNear(t, startTime, 100 + 200)
    })
})

test('retry delayType constant', t => {
  return Promise.resolve()
    .then(() => {
      let delay

      delay = retry.DELAY_TYPES.CONSTANT({times: 3, delay: 100, initialTimes: 3})
      t.equal(delay, 100)

      delay = retry.DELAY_TYPES.CONSTANT({times: 2, delay: 100, initialTimes: 3})
      t.equal(delay, 100)

      delay = retry.DELAY_TYPES.CONSTANT({times: 1, delay: 100, initialTimes: 3})
      t.equal(delay, 100)
    })
})

test('retry delayType linear', t => {
  return Promise.resolve()
    .then(() => {
      let delay

      delay = retry.DELAY_TYPES.LINEAR({times: 3, delay: 100, initialTimes: 3})
      t.equal(delay, 100)

      delay = retry.DELAY_TYPES.LINEAR({times: 2, delay: 100, initialTimes: 3})
      t.equal(delay, 200)

      delay = retry.DELAY_TYPES.LINEAR({times: 1, delay: 100, initialTimes: 3})
      t.equal(delay, 300)
    })
})
