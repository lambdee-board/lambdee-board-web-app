FROM ruby:3.1.3 as rails

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -\
  && apt-get update -qq && apt-get install -qq --no-install-recommends \
    nodejs postgresql-client \
  && apt-get upgrade -qq \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# throw errors if Gemfile has been modified since Gemfile.lock
RUN bundle config --global frozen 1

WORKDIR /usr/src/app

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

EXPOSE 3000

# CMD bundle exec unicorn -c config/unicorn.rb
CMD bin/prod
