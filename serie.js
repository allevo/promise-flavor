'use strict'

function _promiseSerie(promiseFunctions, res) {
  if (promiseFunctions.length === 0) return Promise.resolve(res)

  const firstPromiseFunction = promiseFunctions.shift()
  return firstPromiseFunction().then(r => {
    res.push(r)
    return _promiseSerie(promiseFunctions, res)
  })
}

function promiseSerie(promiseFunctions) {
  return _promiseSerie(promiseFunctions, [])
}

module.exports = promiseSerie
