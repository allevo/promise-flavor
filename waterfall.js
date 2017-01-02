'use strict'

function _waterfallPromise(promiseFunctions, lastResult) {
  if (promiseFunctions.length === 0) return Promise.resolve(lastResult)

  const firstPromiseFunction = promiseFunctions.shift()
  return firstPromiseFunction(lastResult)
    .then(r => {
      return _waterfallPromise(promiseFunctions, r)
    })
}

function waterfallPromise(promiseFunctions) {
  return _waterfallPromise(promiseFunctions, undefined)
}

module.exports = waterfallPromise
