[![license](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![CI](https://github.com/lambdee-board/lambdee-board-web-app/actions/workflows/ci.yml/badge.svg)](https://github.com/lambdee-board/lambdee-board-web-app/actions/workflows/ci.yml)
[![Backend Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/Verseth/9a8c8388655c06d65286da59107df2d2/raw/lambdee_board_web_app__heads_main.json)](https://github.com/lambdee-board/lambdee-board-web-app/actions/workflows/ci.yml)

# Lambdee Web App

Lambdee - Scriptable Agile Board

## Setup
1. `bin/setup`
1. Setup the postgresql server
   - `psql -d template1`
   - `CREATE DATABASE <username>;` where `<username>` is the name of your current system user
   - `\q`

## Development

### Commands

- `bin/setup` -- install/update node.js, postgresql, ruby and run `bin/install`
- `bin/install` -- install missing gems, create missing config files, execute pending migrations
- `bin/debug` -- run the rails backend server in debug mode
- `bin/sidekiq` -- run the sidekiq process
- `bin/dev` -- run the app with all the necessary processes in one terminal window
  - `--nw` or `--no-watch` -- run the app without automatic frontend building on file changes
  - `--ns` or `--no-sidekiq` -- run the app without running the sidekiq process
- `bin/test` - run all backend and frontend tests
- `bin/console` - run the rails console
- `bin/build` - build the frontend React app
- `bin/openapi` - build the OpenAPI documentation from Ruby specs
- `bin/seed` - fill the database with generated data
- `bin/cypress`
  - `open` -- open cypress for testing during development
  - `run` -- run cypress tests headless (without a browser window)
- `bin/doc` -- generate the YARD docs and open them in your browser
- `bundle exec brakeman -I` -- inspect backend security warnings and decide what to do with them

### Architecture

#### Backend

The backend app is written in Ruby on Rails. It serves two purposes:
- hosting the API for the frontend app
- hosting the built frontend app

The `FrontendController` serves the fronted app.

All classes and modules should be named using `PascalCase` eg. `AdminUser`, `UserData`.

All variables and methods should be named using `snake_case` eg. `admin_user`, `user_data`.

All constants (not containing modules or classes) should be named
using `SCREAMING_SNAKE_CASE` eg. `ADMIN_USER`, `USER_DATA`.

All files should be named using `snake_case` eg. `user_data`, `admin_user`.

##### REST API

All paths regarding the REST API should be defined under the `/api` scope.

Furthermore, controllers handling these requests should be defined under the `API` module.

Let's say that you want to implement a GET query for the data of
a particular user.

The controller should be named `API::UsersController` (`app/controllers/api/users_controller.rb`), and the route should be `/api/users/:id`

We use [Jbuilder](https://github.com/rails/jbuilder) views (`app/views`) for building `JSON` responses.

###### Documentation

We document the backend REST API with [swagger/OpenAPI](https://swagger.io/specification/).

The doc file is served under `/api-docs/v1/swagger.yaml`, and there is
a swagger web interface served under `/api-docs`

##### Plain Old Ruby Objects

All regular Ruby classes and modules should be kept
inside the `app/internal` folder.

##### Database models

All `ActiveRecord` models (classes that represent a single record from a particular database table) should be defined under the `DB` namespace.

Let's say that you want to define a User model. The class should be named `DB::User` (`app/models/db/user.rb`) with the database table named `users`.

The `app/models` folder is supposed to store
only `ActiveRecord` related classes/modules.

##### Configuration files

All configuration files should be located in `config/` (preferably using `YAML`). They should be loaded in an initializer file inside `config/initializers/`. Values loaded from these files should be saved in Ruby constants under the `Config` namespace.

Let's say that you want to add a configuration file, which stores GitHub credentials. The file should be named `config/github.yml`.
The initializer should be named `config/initializers/github.rb`, and the content of the config file should be saved in `Config::GITHUB`.

#### Frontend

The frontend app is written in React and lives in the `frontend/` directory. It is built using `esbuild` and copied to the Rails Asset Pipeline, which serves it.

The React app is written in JavaScript with custom
configured `ESLint` rules (`frontend/.eslintrc.yml`).

All components should be named using `PascalCase` eg. `UserData`, `Board`.
File names follow the same convention eg. `UserData.jsx`.

All variables and regular (non-component) functions should be named
using `camelCase` eg. `userData`, `getUser`.

All non-component JS files should be named using `kebab-case` like
`app-alert-store.js`.

##### State management

###### UI state

This app uses [zustand](https://github.com/pmndrs/zustand) for creating stores for UI state. All stores are stored in `frontend/src/stores`.

###### Data fetching

[SWR](https://swr.vercel.app/) is used for guarding the state
of data that is fetched from the backend.

All code interacting with the backend API should be located in
the `frontend/src/api` folder.

We use [Axios](https://github.com/axios/axios) as our HTTP client library.

##### View components

Components representing a single view (page) should be stored in the
`frontend/src/views/` directory. Components should be written in the functional style and named using `PascalCase` eg. `Account`, `UserData`, `ErrorButton`.

Let's say that you want to write an account view. It should be stored in `frontend/src/views/Account.jsx`.

Any `CSS` styles unique to this view should be saved inside `frontend/src/views/Account.css` and imported in the `.jsx` file.

Here is an example of its code:

```js
// frontend/src/views/Account.jsx
import './Account.css'

const Account = () => {
  return (
    <div className="account">
      <h1>Some code</h1>
    </div>
  );
}

export default Account;
```

##### Components

All other components which get used in views should be stored in the
`frontend/src/components/` directory. Components should be written in the functional style and named using PascalCase.

Let's say that you want to write a button component. It should be stored in `frontend/src/components/Button.jsx`.

Any `CSS` styles unique to this component should be saved inside `frontend/src/components/Button.css` and imported in the `.jsx` file.

All `props` used by components should be documented using
the [prop-types](https://reactjs.org/docs/typechecking-with-proptypes.html) package.

Example:

```js
// frontend/src/components/Button.jsx
import './Button.css'
import PropTypes from 'prop-types'

const Button = (props) => {
  return (
    <div className="button">
      <h1>{props.label}</h1>
    </div>
  );
}

Button.propTypes = {
  label: PropTypes.string.isRequired
}

export default Button;
```

## Problems

### Ubuntu

> An error occurred while installing pg (1.3.5)

```sh
$ sudo apt install libpq-dev
```

> LoadError: libffi.so.8: cannot open shared object file

```sh
$ curl -LO https://launchpad.net/ubuntu/+archive/primary/+files/libffi8_3.4.2-4_amd64.deb
$ sudo dpkg -i libffi8_3.4.2-4_amd64.deb
```

> LoadError: libssl.so.1.1: cannot open shared object file

```sh
$ wget http://nz2.archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2.16_amd64.deb
$ sudo dpkg -i libssl1.1_1.1.1f-1ubuntu2.16_amd64.deb
```
### Mainly MacOS

**postgresql**

> LoadError: dlopen(/Users/mateuszdrewniak/.rvm/gems/ruby-3.1.2@lambdee-board-web-app/gems/pg-1.3.5/lib/pg_ext.bundle, 9): Library not loaded: /opt/homebrew/opt/postgresql/lib/libpq.5.dylib
> Referenced from: /Users/mateuszdrewniak/.rvm/gems/ruby-3.1.2@lambdee-board-web-app/gems/pg-1.3.5/lib/pg_ext.bundle
> Reason: image not found - /Users/mateuszdrewniak/.rvm/gems/ruby-3.1.2@lambdee-board-web-app/gems/pg-1.3.5/lib/pg_ext.bundle

Works on MacBook M1

```sh
$ sudo ln -s /opt/homebrew/opt/postgresql@14/lib/postgresql@14/libpq.5.14.dylib /opt/homebrew/opt/postgresql/libpq.5.dylib
$ sudo ln -s /opt/homebrew/opt/postgresql@14/lib/postgresql@14/libpq.5.14.dylib /opt/homebrew/opt/postgresql/lib/libpq.5.dylib
```

<hr>

> ActiveRecord::ConnectionNotEstablished - connection to server on socket "/tmp/.s.PGSQL.5432" failed: No such file or directory

MacBook

```sh
$ rm /usr/local/var/postgres/postmaster.pid
$ brew services restart postgresql
```

MacBook M1

```sh
$ rm /opt/homebrew/var/postgres/postmaster.pid
$ brew services restart postgresql
```

**eventmachine**

> In file included from binder.cpp:20:
> ./project.h:119:10: fatal error: 'openssl/ssl.h' file not found
> #include <openssl/ssl.h>
>          ^~~~~~~~~~~~~~~
> 1 error generated.

1. Install openssl
```sh
$ brew install openssl
```
2. Check the installation path
```sh
$ brew info openssl
...
/opt/homebrew/Cellar/openssl@3/3.0.4_1 (6,442 files, 27.9MB) *
...
```
3. Install gem giving a path from above
```sh
$ gem install eventmachine -- --with-openssl-dir=/opt/homebrew/Cellar/openssl@3/3.0.4_1
```

**puma**

> Gem::Ext::BuildError: ERROR: Failed to build gem native extension.
>
>    current directory: /Users/mateuszdrewniak/.rvm/gems/ruby-3.1.0@dupa/gems/puma-5.6.2/ext/puma_http11
>
> /Users/mateuszdrewniak/.rvm/rubies/ruby-3.1.0/bin/ruby -I /Users/mateuszdrewniak/.rvm/rubies/ruby-3.1.0/lib/ruby/3.1.0 -r ./siteconf20220219-40641-4uxhq6.rb extconf.rb --with-cflags\=-Wno-error\=implicit-function-declaration
>
> checking for BIO_read() in -lcrypto... *** extconf.rb failed ***
>
> Could not create Makefile due to some reason, probably lack of necessary
> libraries and/or headers.  Check the mkmf.log file for more details.  You may
> need configuration options.

```sh
$ gem install puma -- --with-cflags="-fdeclspec"
```
