# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

wrk = ::FactoryBot.create :workspace
4.times { wrk.users << ::FactoryBot.create(:user) }

wrk.boards << board = ::FactoryBot.create(:board)
5.times do
  board.lists << list = ::FactoryBot.create(:list)
  rand(5).times do
    list.tasks << task = ::FactoryBot.create(:task)
    rand(4).times { task.users << ::DB::User.order("RANDOM()").first }
  end
end

3.times { ::FactoryBot.create(:workspace) }
2.times { ::FactoryBot.create(:board, workspace: wrk) }
