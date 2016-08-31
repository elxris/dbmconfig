let _ = require('lodash')
let mongodb = require('mongodb')

let MongoManager = (function () {
  function getCollection () {
    let connection = mongodb.MongoClient.connect(this.__options.url)
    return connection.then((db) => {
      return {collection: db.collection(this.__options.collection), db}
    })
  }
  function MongoManager (options) {
    this.__options = options
  }
  MongoManager.prototype.set = function (key, value) {
    let self = this
    return getCollection.call(self).then(({collection, db}) => {
      let update = {'$set': {}}
      update['$set'][key] = value
      if (value === undefined || value === null) {
        update = {'$unset': {}}
        update['$unset'][key] = ''
      }
      return collection.findOneAndUpdate(self.__options.filter, update, {upsert: true, returnOriginal: false})
        .then((result) => (db.close(), _.get(result.value, key)))
    })
  }
  MongoManager.prototype.get = function (key) {
    let self = this
    return getCollection.call(self).then(({collection, db}) => {
      return collection.findOne(self.__options.filter).then((result) => {
        db.close()
        return _.get(result, key)
      })
    })
  }
  return MongoManager
})()

exports = module.exports = MongoManager
