'use strict'

const mapAnyway = require('./mapAnyway')

function filterAnywayObjectPromise(subjects, promiseFunction) {
  return mapAnyway(subjects, promiseFunction)
    .then(res => {
      const keys = Object.keys(subjects)
      const r = {results: {}, errors: res.errors}
      for(let i=0; i < keys.length; i++) {
        const key = keys[i]
        if (res.results[key] === true) {
          r.results[key] = subjects[key]
        }
      }
      return r
    })
}

function filterAnywayArrayPromise(subjects, promiseFunction) {
  return mapAnyway(subjects, promiseFunction)
    .then(res => {
      const r = {results: [], errors: res.errors}
      for(let i=0; i < subjects.length; i++) {
        if (res.results[i] === true) {
          r.results.push(subjects[i])
        }
      }
      return r
    })
}

function filterAnywayPromise(subjects, promiseFunction) {
  if (!(subjects instanceof Array)) {
    return filterAnywayObjectPromise(subjects, promiseFunction)
  }
  return filterAnywayArrayPromise(subjects, promiseFunction)
}

module.exports = filterAnywayPromise
