json.extract! sprint_task, :id, :task_id, :sprint_id, :added_at, :completed_at, :start_state, :state
json.url api_sprint_tasks_url(sprint_task, format: :json)
