json.extract! task, :id, :name, :pos, :priority, :points, :list_id
json.url api_task_url(task, format: :json)
json.list_url api_list_url(task.list, format: :json)

return if local_assigns[:short]

json.extract! task, :description, :created_at, :updated_at
