FROM ruby:3.1.2

RUN apt-get update -qq \
&& apt-get install -y --no-install-recommends \
nodejs \
npm \
postgresql-client

# throw errors if Gemfile has been modified since Gemfile.lock
RUN bundle config --global frozen 1

ENV RAILS_ROOT /var/www/lambdee-web-app
RUN mkdir -p $RAILS_ROOT

WORKDIR $RAILS_ROOT

# Setting env up
ENV RAILS_ENV='production'
ENV RACK_ENV='production'
ENV NODE_ENV='production'

# Installing NodeJS dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Installing Ruby dependencies
COPY Gemfile Gemfile.lock ./
RUN bundle config set --local without 'development test'
RUN bundle install --jobs 20 --retry 5


COPY . .
RUN cp -r frontend/src/assets/* app/assets/builds
# precompile static assets like .svg, .png
RUN bundle exec rake assets:precompile

RUN bin/build
# precompile the compiled js and css files
RUN bundle exec rake assets:precompile

EXPOSE 3000

# CMD bundle exec unicorn -c config/unicorn.rb
CMD bin/prod
