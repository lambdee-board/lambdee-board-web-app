# frozen_string_literal: true

json.partial! 'api/tasks/task', task: @task

json.list do
  json.partial! 'api/lists/list', list: @task.list
end

json.author do
  json.partial! 'api/users/user', user: @task.author
end

json.users do
  json.array! @task.users do |user|
    json.partial! 'api/users/user', user: user
  end
end

json.tags do
  json.array! @task.tags do |tag|
    json.partial! 'api/tags/tag', tag: tag
  end
end
