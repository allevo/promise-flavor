'use strict'

function wait(nSec) {
  return new Promise(resolve => setTimeout(resolve, nSec))
}

function _retryPromise(promiseFunction, options) {
  return promiseFunction()
    .catch(e => {
      if (options.times === 1) return Promise.reject(e)

      const delayTime = options.delayFunction(options) 
      options.times--
      return wait(delayTime)
        .then(() => _retryPromise(promiseFunction, options))
    })
}

const DELAY_TYPES = {
  LINEAR: function linear(options) { return (options.initialTimes - options.times + 1) * options.delay },
  CONSTANT: function constant(options) { return options.delay },
}

const DEFAULT_TIMES = 3
const DEFAULT_DELAY = 0
const DEFAULT_DELAY_TYPE = DELAY_TYPES.CONSTANT
function retryPromise(promiseFunction, options) {
  const times = (options || {times: DEFAULT_TIMES}).times || DEFAULT_TIMES
  const delay = (options || {delay: DEFAULT_DELAY}).delay || DEFAULT_DELAY
  const delayFunction = (options || {delayType: DEFAULT_DELAY_TYPE}).delayType || DEFAULT_DELAY_TYPE

  if (times < 1) return Promise.reject(new Error('Invalid options: times'))
  if (delay < 0) return Promise.reject(new Error('Invalid options: delay'))

  const _options = {times: times, delay: delay, initialTimes: times, delayFunction: delayFunction}
  return _retryPromise(promiseFunction, _options)
}

retryPromise.DELAY_TYPES = DELAY_TYPES

module.exports = retryPromise
