import test from 'ava'
import config from '../index'

let count = 0
let getOptions = () => {
  return {
    mongo: {
      url: 'mongo://localhost/config',
      collection: 'config',
      query: {
        _id: `my-config-${++count}`
      }
    },
    default: {}
  }
}

test('dbmconfig is a function', t => {
  t.is(typeof config, 'function')
})

test('throws if not argument is provided', t => {
  t.throws(() => {
    config()
  })
})

test('throws if name is undefined', t => {
  t.throws(() => {
    config(undefined, getOptions())
  })
})

test('throws if name argument is not a string', t => {
  t.throws(() => {
    config(1, getOptions())
  })
})

test('throws if options are not an object', t => {
  t.throws(() => {
    config('myConfig', () => {
    })
  })
})

test('dbmconfig returns a dbmconfiguration if only a config argument is provided', t => {
  t.true(config(getOptions()) instanceof config)
})

test('DBMConfig returns a DBMConfiguration function', t => {
  t.true(config('instance', getOptions()) instanceof config)
})

test('DBMConfig without a configuration on created instancename returns previous instance', t => {
  let instance = config('foo', getOptions())
  t.is(config('foo'), instance)
})

test('get() without any default on non existent value should return a rejected promise', t => {
  let instance = config(getOptions())
  return instance.get('foofoo').then(() => {
    t.fail()
  }).catch(() => {
    t.pass()
  })
})

test('get() without any defaut on existent value should return the value', t => {
  let instance = config(getOptions())
  return instance.set('foofoo', 'barbar').then(() => instance.get('foofoo')).then((value) => {
    t.is(value, 'barbar')
  })
})

test('get() with argument defaut, on non existent value should return the argument', t => {
  let instance = config(getOptions())
  return instance.get('foofoo', 'barbar').then((value) => t.is(value, 'barbar'))
})

test('get() with argument default on existent value should return the value', t => {
  let options = getOptions()
  options.default['foofoo'] = 'foofoo'
  let instance = config(options)
  return instance.set('foofoo', 'barbar').then(() => instance.get('foofoo')).then((value) => {
    t.is(value, 'barbar')
  })
})

test('get() with options.default on non existent value should return the options.default value', t => {
  let options = getOptions()
  options.default['foo'] = 'bar'
  let instance = config(options)
  return instance.get('foo').then((value) => {
    t.is(value, options.default['foo'])
  }).catch(() => {
    t.fail()
  })
})

test('get() with options.default on existent value should return the value', t => {
  let options = getOptions()
  options.default['foo'] = 'bar'
  let instance = config(options)
  let val = 'foo'
  return instance.set('foo', val).then(() => instance.get('foo')).then((value) => {
    t.is(value, val)
  }).catch(() => {
    t.fail()
  })
})

test('get() with options and arguments defaults on non existent value should return the argument', t => {
  let options = getOptions()
  options.default['foo'] = 'bar'
  let instance = config(options)
  let val = 'foo'
  return instance.get('foo', val).then((value) => {
    t.is(value, val)
  }).catch(() => t.fail())
})

test('get() with options and arguments defaults on existent value should return the value', t => {
  let options = getOptions()
  options.default['foo'] = 'bar'
  let instance = config(options)
  let val = 'foo'
  return instance.set('foo', 'foobar').then(() => instance.get('foo', val)).then((value) => {
    t.is(value, 'foobar')
  }).catch(() => t.fail())
})

test('set(key, undefined) with options.default should resolve get(key) with options.default', t => {
  let options = getOptions()
  options.default['foo'] = 'foo'
  let instance = config(options)
  return instance.set('foo', 'bar')
    .then(() => instance.get('foo'))
    .then((value) => {
      if (value !== 'bar') {
        return Promise.reject("Not setted set('foo', 'bar')")
      }
    }).then(() => instance.set('foo', undefined))
    .then(() => instance.get('foo'))
    .then((value) => {
      t.is(value, options.default['foo'])
    }).catch((e) => t.fail(e))
})