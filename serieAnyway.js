'use strict'

function _serieAnywayPromise(promiseFunctions, res) {
  if (promiseFunctions.length === 0) return Promise.resolve(res)

  const firstPromiseFunction = promiseFunctions.shift()
  return firstPromiseFunction()
    .then(r => {
      res.results.push(r)
      res.errors.push(undefined)
      return _serieAnywayPromise(promiseFunctions, res)
    })
    .catch(e => {
      res.results.push(undefined)
      res.errors.push(e)
      return _serieAnywayPromise(promiseFunctions, res)
    })
}

function serieAnywayPromise(promiseFunctions) {
  return _serieAnywayPromise(promiseFunctions, {errors: [], results: []})
}
module.exports = serieAnywayPromise
