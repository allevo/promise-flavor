'use strict'

function parallelObjectPromise(promiseFunctions) {
  const results = {}
  const keys = Object.keys(promiseFunctions)
  const promises = keys.map(key => {
    return promiseFunctions[key]()
      .then(r => results[key] = r)
  })
  return Promise.all(promises)
    .then(() => results)
}

function parallelArrayPromise(promiseFunctions) {
  const promises = promiseFunctions.map(f => f())
  return Promise.all(promises)
}

function parallelPromise(promiseFunctions) {
  if (!(promiseFunctions instanceof Array)) {
    return parallelObjectPromise(promiseFunctions)
  }
  return parallelArrayPromise(promiseFunctions)
}

module.exports = parallelPromise
