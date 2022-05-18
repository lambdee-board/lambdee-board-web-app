json.extract! task, :id, :name, :description, :pos, :list_id, :created_at, :updated_at
json.url api_task_url(task, format: :json)
