# frozen_string_literal: true

json.partial! 'api/boards/board', board: @board

json.lists do
  json.array! @board.lists do |list|
    json.partial! 'api/lists/list', list: list
    json.tasks do
      json.array! list.tasks do |task|
        json.partial! 'api/tasks/task', task: task, short: true
        json.users do
          json.array! task.users do |user|
            json.partial! 'api/users/user', user: user, short: true
          end
        end
      end
    end
  end
end
