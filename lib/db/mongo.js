let _ = require('lodash')
let mongodb = require('mongodb')

let MongoManager = (function () {
  function getCollection () {
    return this.__db.then((db) => {
      return Promise.resolve(db.collection(this.__options.collection))
    })
  }
  function MongoManager (options) {
    this.__options = options
    this.__db = mongodb.MongoClient.connect(options.url)
  }
  MongoManager.prototype.set = function (key, value) {
    let self = this
    return getCollection.call(self).then((cl) => {
      let update = {'$set': {}}
      update['$set'][key] = value
      return cl.findOneAndUpdate(self.__options.filter, update, {upsert: true, returnOriginal: false})
    }).then((result) => _.get(result.value, key))
  }
  MongoManager.prototype.get = function (key) {
    let self = this
    return getCollection.call(self).then((cl) => {
      return cl.findOne(self.__options.filter).then((result) => {
        return _.get(result, key)
      })
    })
  }
  return MongoManager
})()

exports = module.exports = MongoManager
