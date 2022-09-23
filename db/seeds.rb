# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

if ::Rails.env.production?
  require_relative 'seeds.prod'
elsif ::Rails.env.test?
  require_relative 'seeds.cypress'
else
  # require_relative 'seeds.cypress'
  require_relative 'seeds.dev'
end
