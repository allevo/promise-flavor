'use strict'

const map = require('./map')

function filterObjectPromise(subjects, promiseFunction) {
  return map(subjects, promiseFunction)
    .then(res => {
      const keys = Object.keys(subjects)
      const r = {}
      for(let i=0; i < keys.length; i++) {
        const key = keys[i]
        if (res[key] === true) {
          r[key] = subjects[key]
        }
      }
      return r
    })
}

function filterArrayPromise(subjects, promiseFunction) {
  return map(subjects, promiseFunction)
    .then(res => {
      const r = []
      for(let i=0; i < subjects.length; i++) {
        if (res[i] === true) {
          r.push(subjects[i])
        }
      }
      return r
    })
}

function filterPromise(subjects, promiseFunction) {
  if (!(subjects instanceof Array)) {
    return filterObjectPromise(subjects, promiseFunction)
  }
  return filterArrayPromise(subjects, promiseFunction)
}

module.exports = filterPromise
