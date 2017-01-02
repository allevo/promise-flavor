'use strict'

function getArrayOfUndefined(length) {
  const arr = new Array(length)
  arr.fill(undefined)
  return arr
}

function parallelAnywayObjectPromise(promiseFunctions) {
  const results = {}
  const errors = {}

  const promises = Object.keys(promiseFunctions).map(key => {
    return promiseFunctions[key]()
      .then(r => results[key] = r)
      .catch(r => errors[key] = r)
  })
  return Promise.all(promises)
    .then(() => { return { results: results, errors: errors } })
}

function parallelAnywayArrayPromise(promiseFunctions) {
  const results = getArrayOfUndefined(promiseFunctions.length)
  const errors = getArrayOfUndefined(promiseFunctions.length)

  const promises = promiseFunctions.map((f, i) => {
    return f()
      .then(r => results[i] = r)
      .catch(e => errors[i] = e)
  })

  return Promise.all(promises)
    .then(() => { return { results: results, errors: errors } })
}

function parallelAnywayPromise(promiseFunctions) {
  if (!(promiseFunctions instanceof Array)) {
    return parallelAnywayObjectPromise(promiseFunctions)
  }
  return parallelAnywayArrayPromise(promiseFunctions)
}

module.exports = parallelAnywayPromise
