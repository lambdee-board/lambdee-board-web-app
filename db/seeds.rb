# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

def create_board(workspace)
  workspace.boards << board = ::FactoryBot.create(:board)
  board.lists << list = ::FactoryBot.create(:list, name: 'Backlog')
  task = ::FactoryBot.create(:task, list: list, name: 'Add a login system', priority: 2, points: 3)
  5.times do |i|
    board.lists << list = ::FactoryBot.create(:list)
    rand(5).times do
      task = ::FactoryBot.create(:task, list: list)
      rand(4).times { task.users << ::FactoryBot.create(:user) }
    end
  end

  board
end

usr = ::FactoryBot.create(:user)
wrk = ::FactoryBot.create :workspace
wrk.users << usr
2.times { create_board(wrk) }

2.times { ::FactoryBot.create(:board, workspace: wrk) }

wrk = ::FactoryBot.create :workspace
wrk.users << usr
3.times { create_board(wrk) }
wrk = ::FactoryBot.create :workspace
wrk.users << usr
create_board(wrk)
4.times { wrk.users << ::FactoryBot.create(:user) }

3.times { ::FactoryBot.create(:workspace) }
