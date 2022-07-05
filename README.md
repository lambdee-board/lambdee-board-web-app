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
- `bin/dev` -- run the app with all the necessary processes in one terminal window
  - `--ng` or `--no-guard` -- run the app without automatic page refreshing on file changes
  - `--nw` or `--no-watch` -- run the app without automatic frontend building on file changes
- `bin/test` - run all backend and frontend tests
- `bin/console` - run the rails console
- `bin/build` - build the frontend React app
- `bin/openapi` - build the OpenAPI documentation from Ruby specs
- `bin/seed` - fill the database with generated data
- `bin/cypress`
  - `open` -- open cypress for testing during development
  - `run` -- run cypress tests headless (without a browser window)
- `bin/doc` -- generate the YARD docs and open them in your browser
- `brakeman -I` -- inspect backend security warnings and decide what to do with them

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

All components should be named using `PascalCase` eg, `UserData`, `Board`.

All variables and regular (non-component) functions should be named
using `camelCase` eg. `userData`, `getUser`.

##### State management

###### UI state

This app uses [Redux](https://redux.js.org/) as its global store for UI
state. All code regarding `Redux` is stored in `frontend/src/redux`.

The main store is located in `frontend/src/redux/store.js`.
All reducers, actions and selectors having to do with
a single part of the UI should be stored in a `Slice` file inside `frontend/src/redux/slices`.

###### Data fetching

[SWR](https://swr.vercel.app/) is used for guarding the state
of data that is fetched from the backend.

All code interacting with the backend API should be located in
the `frontend/src/api` folder.

We use [Axios](https://github.com/axios/axios) as our HTTP client library.

##### View components

Components representing a single view (page) should be stored in the
`frontend/src/views/` directory. Components should be written in the functional style and named using `PascalCase` eg. `Account`, `UserData`, `ErrorButton`.

Let's say that you want to write an account view. It should be stored in `frontend/src/views/Account.js`.

Any `CSS` styles unique to this view should be saved inside `frontend/src/views/Account.css` and imported in the `.js` file.

Here is an example of its code:

```js
// frontend/src/views/Account.js
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

Let's say that you want to write a button component. It should be stored in `frontend/src/components/Button.js`.

Any `CSS` styles unique to this component should be saved inside `frontend/src/components/Button.css` and imported in the `.js` file.

All `props` used by components should be documented using
the [prop-types](https://reactjs.org/docs/typechecking-with-proptypes.html) package.

Example:

```js
// frontend/src/components/Button.js
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

##### Assets

Assets like images should be stored in `frontend/src/assets`.

If you want to use these assets inside a `.js` file, you should rename it to `.js.erb` and use ERB (Embedded Ruby) to get its path.

Example:

```js
// frontend/src/components/Logo.js.erb

import './Logo.css';

function Logo() {
  return (
    // this will return a url for `frontend/src/assets/logo.svg`
    <img  src="<%= asset_path('logo.svg') %>"
          className="logo"
          alt="logo" />
  );
}

export default Logo;
```

## Problems

### Ubuntu

> LoadError: libffi.so.8: cannot open shared object file

```sh
$ curl -LO https://launchpad.net/ubuntu/+archive/primary/+files/libffi8_3.4.2-4_amd64.deb
$ sudo dpkg -i libffi8_3.4.2-4_amd64.deb
```

### Mainly MacOS

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
