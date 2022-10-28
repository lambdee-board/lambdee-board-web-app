json.extract! sprint_task, :id, :task_id, :sprint_id, :data
json.url api_sprint_tasks_url(sprint_task, format: :json)
