'use strict'

function mapObjectPromise(subject, promiseFunction) {
  const results = {}
  const keys = Object.keys(subject)
  const promises = keys.map(key => {
    return promiseFunction(subject[key], key)
      .then(r => results[key] = r)
  })
  return Promise.all(promises)
    .then(() => results)
}

function mapArrayPromise(subjects, promiseFunction) {
  const promises = subjects.map(function (s, i) { return promiseFunction(s, i) })
  return Promise.all(promises)
}

function mapPromise(subjects, promiseFunction) {
  if (!(subjects instanceof Array)) {
    return mapObjectPromise(subjects, promiseFunction)
  }
  return mapArrayPromise(subjects, promiseFunction)
}

module.exports = mapPromise
