# Lambdee Web App

Lambdee - Scriptable Agile Board

## Setup
1. `bin/setup`

## Development

### Commands

- `bin/setup` - install/update node.js, mysql, ruby and run `bin/install`
- `bin/install` - install missing gems, create missing config files, execute pending migrations
- `bin/dev` - run the app with all the necessary processes in one terminal window
- `bin/console` - run the rails console
- `bin/build` - build the frontend React app
- `bin/doc` - generate the YARD docs and open them in your browser

## Problems

**eventmachine**

> In file included from binder.cpp:20:
> ./project.h:119:10: fatal error: 'openssl/ssl.h' file not found
> #include <openssl/ssl.h>
>          ^~~~~~~~~~~~~~~
> 1 error generated.

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