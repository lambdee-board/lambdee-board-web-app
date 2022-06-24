# frozen_string_literal: true

json.partial! 'api/lists/list', list: @list

json.tasks do
  json.array! @list.public_send(tasks).pos_order do |task|
    json.partial! 'api/tasks/task', task: task, short: true
    json.users do
      json.array! task.users do |user|
        json.partial! 'api/users/user', user: user, short: true
      end
    end
    json.tags do
      json.array! task.tags do |tag|
        json.partial! 'api/tags/tag', tag: tag, short: true
      end
    end
  end
end
