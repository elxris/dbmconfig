
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
    return this.__mgr.set(key, value)
  }
  Config.prototype.get = function (key, defaultValue) {
    return this.__mgr.get(key)
      .then((value) => value || defaultValue || this.__defaults[key])
      .then((value) => {
        if (value === undefined) return Promise.reject(new Error('Value not found'))
        return value
      })
  }
  return Config
})()

exports = module.exports = Config
