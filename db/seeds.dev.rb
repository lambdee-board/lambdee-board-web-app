# frozen_string_literal: true

pri =         ::FactoryBot.create(:user, email: "system@example.com", name: 'System PRI', role: :admin)
przedszkole = ::FactoryBot.create(:user, email: "przedszkole@example.com", name: 'Wirtualne Przedszkole', role: :admin)
studenckie =  ::FactoryBot.create(:user, email: "mieszkanie@example.com", name: 'Mieszkanie Studenckie', role: :admin)
zdjecia =     ::FactoryBot.create(:user, email: "kalorycznosc@example.com", name: 'Kaloryczność Zdjęcia', role: :admin)
lambdee =     ::FactoryBot.create(:user, email: "lambdee@example.com", name: 'Lambdee', role: :admin)

script = ::FactoryBot.create(:script, name: 'TEST SCRIPT puts id of subject', content: 'puts "Action run on id: #{subject&.id}"')
# Global ui script trigger
::FactoryBot.create(:ui_script_trigger, author: lambdee, text: 'Run global', script: script)
wrk = ::FactoryBot.create(:workspace, name: 'test scripts')
board = ::FactoryBot.create(:board, workspace: wrk, name: 'test scripts')
list = ::FactoryBot.create(:list, board: board, name: 'To Do')
task = ::FactoryBot.create(:task, list: list, name: 'Nice task')
::FactoryBot.create(:ui_script_trigger, author: lambdee, script: script, subject: wrk, text: 'Run on workspace')
::FactoryBot.create(:ui_script_trigger, author: lambdee, script: script, subject: board, text: 'Run on board')
::FactoryBot.create(:ui_script_trigger, author: lambdee, script: script, subject: board, text: 'Run on board - second', colour: '#123456')
::FactoryBot.create(:ui_script_trigger, author: lambdee, script: script, subject_type: 'DB::Task', scope: board, text: 'Run on task')

::FactoryBot.create(:script, name: 'Foo script')
::FactoryBot.create(:script, name: 'Bar script')
::FactoryBot.create(:script, name: 'Example script')

def create_board(workspace)
  tags_amount = 5
  workspace.boards << board = ::FactoryBot.create(:board)
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

  time = '2022-11-07 19:48:59'.to_time
  sprint = ::FactoryBot.create(:sprint, board:, started_at: time, expected_end_at: time + 7.days, ended_at: time + 7.days)
  sprint.sprint_tasks.last(2).each_with_index { _1.update!(added_at: time + _2.days) }
  sprint.sprint_tasks.first(sprint.sprint_tasks.size - 2).each { _1.update!(completed_at: time + rand(7).days) }
  sprint.sprint_tasks.last(2).each { _1.update!(completed_at: nil) }

  board
end

wrk = ::FactoryBot.create :workspace
wrk.users << pri
wrk.users << przedszkole
wrk.users << studenckie
wrk.users << zdjecia
wrk.users << lambdee
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
