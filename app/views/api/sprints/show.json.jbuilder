json.partial! 'sprint', sprint: @sprint

if local_assigns[:tasks] == 'all'
  json.tasks do
    json.array! @sprint.sprint_tasks.includes(:task) do |sprint_task|
      task = sprint_task.task
      json.id task.id
      json.name task.name
      json.priority task.priority
      json.spent_time task.spent_time
      json.points task.points
      json.added_at sprint_task.added_at
      json.completed_at sprint_task.completed_at
      json.start_state sprint_task.start_state
      json.state sprint_task.state
    end
  end
end
