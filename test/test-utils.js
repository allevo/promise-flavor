'use strict'

function generatePromise(conf) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (conf.err ? reject : resolve)(conf.err || conf.result)
    }, conf.delay || 0)
  })
}

const UPPER_TIMEOUT_TOLLERANCE_MSEC = 60
const LOWER_TIMEOUT_TOLLERANCE_MSEC = 1

function checkTimeNear(t, startTime, goal) {
  var delta = Date.now() - startTime
  t.ok(delta < (goal + UPPER_TIMEOUT_TOLLERANCE_MSEC), 'Not too late: ' + delta)
  t.ok(delta > (goal - LOWER_TIMEOUT_TOLLERANCE_MSEC), 'Not too soon: ' + delta)
}

module.exports = {
  generatePromise: generatePromise,
  checkTimeNear: checkTimeNear,
}
