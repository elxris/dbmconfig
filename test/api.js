import test from 'ava'
import config from '../index'

let getOptions = () => {
  return {
    mongo: {
      url: 'mongo://localhost/config',
      collection: 'config',
      query: {
        _id: 'my-config'
      }
    },
    default: {
      foo: 'bar',
      foobar: { foo: 'barfoo' }
    },
    cached: {
      enabled: true,
      update: {
        time: '300s'
      }
    }
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
    config('myConfig', () => {})
  })
})

test('DBMConfig returns a DBMConfiguration function', t => {
  t.true(config('instance', getOptions()) instanceof config)
})

test('DBMConfig without a configuration returns previous instance', t => {
  let instance = config('foo', getOptions())
  t.is(config('foo'), instance)
})

test('get() without default on non existent value should return a rejected promise', t => {
  let instance = config('foo1', getOptions())
  return instance.get('foofoo').then(() => {
    t.fail()
  }).catch(() => {
    t.pass()
  })
})

test('get() with options.default on non existent value should return the default value', t => {
  let options = getOptions()
  // options.default.foo == 'bar'
  let instance = config('foo2', options)
  return instance.get('foo').then((value) => {
    t.is(value, options.default['foo'])
  }).catch(() => {
    t.fail()
  })
})

test('get() with options.default on existent value should return the value', t => {
  let options = getOptions()
  let instance = config('foo3', options)
  let val = 'foobarfoo'
  instance.set('foo', val)
  return instance.get('foo').then((value) => {
    t.is(value, val)
  }).catch(() => {
    t.fail()
  })
})
