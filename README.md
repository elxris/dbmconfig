DataBase Managed Configuration
=============================
# Spec.
## Problema
Las aplicaciones necesitan variables permanentes y compartidas a lo largo de las
instancias de la aplicación.
Necesitan ser accesibles y modificables.

## Limitantes
Si se usa con frecuencia o en alguna operación crítica en velocidad se debe
considerar que por velocidad no se podría consutar cada vez o si se hace podría
ser la base de datos un cuello de botella.

## Hipótesis
Una librería con una sencilla api podría cubrir nuestras necesidades, porque:
- Una función puede devolver un valor, este valor puede estar cacheado e
internamente poder jalar ese valor cada cierto tiempo, con backoffs.
- Podría pasarse la configuración de la base de datos, por lo que podría ser una
solución multibase de datos, con una capa de compatibilidad.

### Usage
init-dbm-config.js
``` javascript
const DBMConfig = require('dbmconfig')
const options = {
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
DBMConfig('myConfigName', config)
```
where-i-need-to-use.js
``` javascript
const config = require('dbmconfig')('myConfigName')
// ... inside a function or callback
  config.get('foo') // returns a Promise that resolves to 'bar', can be rejected on error.
  config.set('ayy', 'lmao') // returns a Promise that can be rejected on error.
  config.cached('ayy') // returns 'lmao'
  config.cached('foobar.foo') // returns 'barfoo' because the defaults.

  config.get('emptyVariable') // returns a Promise that will fail.
  config.get('emptyVariable', 'default') // returns a Promise that resolves to 'default'

  config.cached('emptyVariable') // return NULL
  config.cached('emptyVariable', 'default') // return 'default'.
//
```


### API
__DBMConfigInstance__ DBMConfig(___namespace___, ___options___)
Store the options in the given namespace and returns a instance. Overrides the namespace.
- _Object_ namespace
- _Object_ options

__DBMConfigInstance__ DBMConfig(___namespace___)
Gets the reference to the previous DBMConfigInstance created and configured.
- _String_ namespace: Nombre del namespace.

__Promise(JSON | String | Number | Boolean)__ DBMConfigInstance.get(___key___, [___default___])
Get the value of the given key. Supports nested config like `foo.bar` for something like `{ foo: { bar: 'value' } }`. returns a Promise that resolves the value. If default is not defined and the value is not available the Promise is rejected.
- _String_ key: The key of the stored value.
- _String_ default: If the value is not available, then resolves to the default.

__JSON | String | Number | Boolean | Null__ DBMConfigInstance.cached(___key___, [___default___])
Get the value of the given key. Supports nested config like `foo.bar` for something like `{ foo: { bar: 'value'}}`. If default is not defined and the values is not available then this returns _null_. The cached system checks if exist in the cache, if not: check the default argument, if not: check in the instance options defaults.
- _String_ key: The key of the stored value.
- _String_ default: If the value is not available, then resolves to the defaut.

__Promise__ DBMConfigInstance.set(___key___, ___value___)
Set in a JSON Object the value in the given key. If a null is given at value, the key will be removed of the config. If there was a default, the default is not erased.
- _String_ key: The key of the stored value.
- _JSON | String | Number | Boolean | Null_
