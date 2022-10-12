class RenameTagTasksToTaskTags < ActiveRecord::Migration[7.0]
  def change
    rename_table :tags_tasks, :task_tags
    rename_table :tasks_users, :task_users
  end
end
