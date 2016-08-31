let _ = require('lodash')

let MongoManager = require('./mongo')

let DBManager = (function () {
  function DBManager (options) {
    if (_.isPlainObject(options.mongo)) {
      return new MongoManager(options.mongo)
    }
    throw new Error('Database configuration not found')
  }
  return DBManager
})()

exports = module.exports = DBManager
