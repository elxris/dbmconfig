DataBase Managed Configuration
=============================
## Problema
Las aplicaciones necesitan variables permanentes y compartidas a lo largo de las
instancias de la aplicación.
Necesitan ser accesibles y modificables.

## Limitantes
Si se usa con frecuencia o en alguna operación crítica en velocidad se debe
considerar que por velocidad no se podría consutar cada vez o si se hace podría
ser la base de datos un cuello de botella.
Otra limitante es la base de datos que se elija. Por defecto es mongodb y la
limitante que tiene esto es que cada documento (configuración) sólo puede tener
16MB de datos.

## Hipótesis
Una librería con una sencilla api podría cubrir nuestras necesidades, porque:
- Una función puede devolver un valor.
- Podría pasarse la configuración de la base de datos, por lo que podría ser una
solución multibase de datos, con una capa de compatibilidad.

### Usage
init-dbm-config.js
``` javascript
const DBMConfig = require('dbmconfig')
const options = {
  mongo: {
    url: 'mongodb://localhost/config',
    collection: 'config',
    filter: {
      _id: 'my-config'
    }
  },
  default: {
    foo: 'bar',
    foobar: { foo: 'barfoo' }
  }
}
exports.config = DBMConfig(config)
```
where-i-need-to-use.js
``` javascript
const config = require('./init-dbm-config')
// ... inside a function or callback
  config.get('foo') // returns a Promise that resolves to 'bar', can be rejected on error.
  config.set('ayy', 'lmao') // returns a Promise that can be rejected on error.

  config.get('emptyVariable') // returns a Promise that will fail.
  config.get('emptyVariable', 'default') // returns a Promise that resolves to 'default'
//
```


### API
__DBMConfigInstance__ DBMConfig(___options___)
Store the options in the given namespace and returns a instance. Overrides the namespace.
- _Object_ options

__Promise(JSON | String | Number | Boolean)__ DBMConfigInstance.get(___key___, [___default___])
Get the value of the given key. Supports nested config like `foo.bar` for something like `{ foo: { bar: 'value' } }`. returns a Promise that resolves the value. If default is not defined and the value is not available the Promise is rejected.
- _String_ key: The key of the stored value.
- _String_ default: If the value is not available, then resolves to the default.

__Promise__ DBMConfigInstance.set(___key___, ___value___)
Set in a JSON Object the value in the given key. If a null is given at value, the key will be removed of the config. If there was a default, the default is not erased.
- _String_ key: The key of the stored value.
- _JSON | String | Number | Boolean | Null_ value: The value to be set. If null, erases it.

### Run the tests

All you have to do is download the project and install all the dependencies
launch a local instance of MongoDB and type `npm test` on your terminal.
