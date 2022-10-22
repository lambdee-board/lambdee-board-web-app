# frozen_string_literal: true

def create_board(workspace)
  tags_amount = 5
  workspace.boards << board = ::FactoryBot.create(:board)

  # active_sprint = ::FactoryBot.create(:sprint, :active)

  tags_amount.times { ::FactoryBot.create(:tag, board:) }

  ::FactoryBot.create(:list, board:, name: 'Hidden', visible: false)
  5.times do |i|
    list = ::FactoryBot.create(:list, board:, visible: true)
    rand(5).times do
      task = ::FactoryBot.create(:task, list:)
      rand(4).times { task.users << ::FactoryBot.create(:user) }
      task.tags << board.tags.order("RANDOM()").last(rand(tags_amount))
      rand(2).times { task.comments << ::FactoryBot.create(:comment) }
    end
  end

  board
end

wrk = ::FactoryBot.create :workspace
wrk.users << usr = ::FactoryBot.create(:user)
wrk.users << ::FactoryBot.create(:user, name: 'Madonna Berge', role: :regular)
wrk.users << ::FactoryBot.create(:user, name: 'Brice Spinka', role: :developer)
wrk.users << ::FactoryBot.create(:user, name: 'Rupert Reichel', role: :manager)
wrk.users << ::FactoryBot.create(:user, name: 'Bee Trantow', role: :admin)

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
