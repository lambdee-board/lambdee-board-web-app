json.extract! sprint_tasks, :id, :task_id, :sprint_id, :data
json.url api_sprint_tasks_url(sprint_tasks, format: :json)
