'use strict'

function generatePromise(conf) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (conf.err ? reject : resolve)(conf.err || conf.result)
    }, conf.delay || 0)
  })
}

const UPPER_TIMEOUT_TOLLERANCE_MSEC = 40
const LOWER_TIMEOUT_TOLLERANCE_MSEC = 1

function checkTimeNear(t, startTime, goal) {
  t.ok(Date.now() - startTime < goal + UPPER_TIMEOUT_TOLLERANCE_MSEC, 'Not too late')
  t.ok(Date.now() - startTime > goal - LOWER_TIMEOUT_TOLLERANCE_MSEC, 'Not too soon')
}

module.exports = {
  generatePromise: generatePromise,
  checkTimeNear: checkTimeNear,
}
