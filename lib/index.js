
let _ = require('lodash')
let DBManager = require('./db')

let Config = (function () {
  function Config (options) {
    if (!(this instanceof Config)) {
      return new Config(options)
    }
    if (!options) {
      throw new Error('Configuration not provided')
    }
    this.__options = options || {}
    this.__defaults = options.default || {}
    this.__mgr = new DBManager(options)
  }
  Config.prototype.set = function (key, value) {

  }
  Config.prototype.get = function (key, defaultValue) {

  }
  return Config
})()

exports = module.exports = Config
