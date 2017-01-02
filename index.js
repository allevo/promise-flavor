'use strict'

module.exports = {
  // classic
  parallel: require('./parallel'),
  serie: require('./serie'),
  map: require('./map'),
  filter: require('./filter'),
  // waterfall
  waterfall: require('./waterfall'),
  // retry
  retry: require('./retry'),
  // auto
  auto: require('./auto'),
  // anyway
  parallelAnyway: require('./parallelAnyway'),
  serieAnyway: require('./serieAnyway'),
  mapAnyway: require('./mapAnyway'),
  filterAnyway: require('./filterAnyway'),
}
