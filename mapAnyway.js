'use strict'

function getArrayOfUndefined(length) {
  const arr = new Array(length)
  arr.fill(undefined)
  return arr
}

function mapAnywayObjectPromise(subject, promiseFunction) {
  const results = {}
  const errors = {}

  const keys = Object.keys(subject)
  const promises = keys.map(key => {
    return promiseFunction(subject[key], key)
      .then(r => results[key] = r)
      .catch(e => errors[key] = e)
  })
  return Promise.all(promises)
    .then(() => { return { results: results, errors: errors } })
}

function mapAnywayArrayPromise(subject, promiseFunction) {
  const results = getArrayOfUndefined(subject.length)
  const errors = getArrayOfUndefined(subject.length)

  const promises = subject.map((s, i) => {
    return promiseFunction(s, i)
      .then(r => results[i] = r)
      .catch(e => errors[i] = e)
  })
  return Promise.all(promises)
    .then(() => { return { results: results, errors: errors } })
}

function mapAnywayPromise(subject, promiseFunction) {
  if (!(subject instanceof Array)) {
    return mapAnywayObjectPromise(subject, promiseFunction)
  }
  return mapAnywayArrayPromise(subject, promiseFunction)
}

module.exports = mapAnywayPromise
