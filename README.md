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

- `bin/setup` - install/update node.js, mysql, ruby and run `bin/install`
- `bin/install` - install missing gems, create missing config files, execute pending migrations
- `bin/dev` - run the app with all the necessary processes in one terminal window
- `bin/console` - run the rails console
- `bin/build` - build the frontend React app
- `bin/doc` - generate the YARD docs and open them in your browser

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

##### Database models

All `ActiveRecord` models (classes that represent a single record from a particular database table) should be defined under the `DB` namespace.

Let's say that you want to define a User model. The class should be named `DB::User` (`app/models/db/user.rb`) with the database table named `users`.

##### Configuration files

All configuration files should be located in `config/` (preferably using `YAML`). They should be loaded in an initializer file inside `config/initializers/`. Values loaded from these files should be saved in Ruby constants under the `Config` namespace.

Let's say that you want to add a configuration file, which stores GitHub credentials. The file should be named `config/github.yml`.
The initializer should be named `config/initializers/github.rb`, and the content of the config file should be saved in `Config::GITHUB`.

#### Frontend

The frontend app is written in React and lives in the `frontend/` directory. It is built using `esbuild` and copied to the Rails Asset Pipeline, which serves it.

All components should be named using `PascalCase` eg, `UserData`, `Board`.

All variables and regular (non-component) functions should be named
using `camelCase` eg. `userData`, `getUser`.

##### View components

Components representing a single view (page) should be stored in the
`frontend/src/views/` directory. Components should be written in the functional style and named using `PascalCase` eg. `Account`, `UserData`, `ErrorButton`.

Let's say that you want to write an account view. It should be stored in `frontend/src/views/Account.js`.

Any `CSS` styles unique to this view should be saved inside `frontend/src/views/Account.css` and imported in the `.js` file.

Here is an example of its code:

```js
// frontend/src/views/Account.js
import './Account.css'

const Account = (props) => {
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

Here is an example of its code:

```js
// frontend/src/components/Button.js
import './Button.css'

const Button = (props) => {
  return (
    <div className="button">
      <h1>Some code</h1>
    </div>
  );
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

**eventmachine**

> In file included from binder.cpp:20:
> ./project.h:119:10: fatal error: 'openssl/ssl.h' file not found
> #include <openssl/ssl.h>
>          ^~~~~~~~~~~~~~~
> 1 error generated.
- intel
  ```sh
  $ gem install eventmachine -- --with-openssl-dir=/usr/local/Cellar/openssl@1.1/1.1.1n/
  ```
- m1/arm
  ```sh
  $ gem install eventmachine -- --with-openssl-dir=/opt/homebrew/Cellar/openssl@1.1/1.1.1n/
  ```

**mysql2**

> == Preparing database ==
>
> dyld: lazy symbol binding failed: Symbol not found: _mysql_server_init
>   Referenced from: /Users/mateuszdrewniak/.rvm/gems/ruby-3.1.0@snippetz-app/gems/mysql2-0.5.3/lib/mysql2/mysql2.bundle
>   Expected in: flat namespace
>
> dyld: Symbol not found: _mysql_server_init
>   Referenced from: /Users/mateuszdrewniak/.rvm/gems/ruby-3.1.0@snippetz-app/gems/mysql2-0.5.3/lib/mysql2/mysql2.bundle
>   Expected in: flat namespace
>
> == Command ["bin/rails db:prepare"] failed ==

```sh
$ gem install mysql2 -V -- --with-ldflags=-L/usr/local/opt/openssl/lib --with-cppflags=-I/usr/local/opt/openssl/include
```

or

```sh
export LIBRARY_PATH=$LIBRARY_PATH:$(brew --prefix zstd)/lib/
brew install shared-mime-info
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