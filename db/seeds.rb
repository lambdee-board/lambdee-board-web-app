# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

if ::Rails.env.production?
  load ::Rails.root.join('db/seeds.prod.rb').to_s
elsif ::Rails.env.test?
  load ::Rails.root.join('db/seeds.dev.rb').to_s
else
  load ::Rails.root.join('db/seeds.dev.rb').to_s
end
