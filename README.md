# tetra-config

Setup, manage and validate configuration files for Locomotive/Express applications.

## Project Setup

`tetra-config` expects the following project structure

```
- config
    - convict (optional)
        - schema.json
    - environments
        - all
            - config.json
            - all.js
        - development (optional)
            - config.json
            - all.js
        - production (optional)
            - config.json
            - all.js
```

Only `config/environments/all` is a required directory - everything else is optional.

## How it works

When you load `tetra-config` for the first time, the following steps are performed

1. We fetch the `tetra-config` schema file, which sets up some default properties required
by all `tetra.io` projects. These will be namespaced under `config.tetra`

2. We look for a project schema in `config/convict/schema.json`. If present, we merge this into the
`tetra-config` schema, with the application schema taking precedence

3. We initialise a Convict configuration object, using our merged schema file. Properties present in the schema
will be created on the object, and initialised with their default value

4. The global configuration file is fetched from `config/environments/all/config.json`. This file
is for configuration that is shared between development and production mode; we merge its properties into
the configuration object.

5. The environment configuration is fetched, from `config/environments/production/config.json` if `NODE_ENV` is
set to production; otherwise we look in `config/environments/development/config.json`. We merge its properties
into our config object.

6. If we find a `.bowerrc` file in the root of the project directory, we use its value for `config.tetra.external_components`, overriding
the default value set in step 1

7. We validate the final configuration object against the merged schema we created in steps 1 and 2. If the
validation fails, an error is thrown

8. If the validation passes, the Convict configuration is transformed into a plain object that is returned from
the original `require('tetra-config')` call.

## Usage

Simply include the library in your `package.json`. You can then access your configuration
anywhere in your application like so

```javascript
var config = require('tetra-config');

console.log(config); // Outputs the config object
```

Remember that anything you add or delete from the config object will be persisted.

If you need to validate your custom configuration, add a Convict-compatible `schema.json` to `config/convict`.