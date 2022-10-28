class AddReferencesInSprintTasks < ActiveRecord::Migration[7.0]
  def change
    add_foreign_key :sprint_tasks, :sprints, column: :sprint_id, null: false
    add_foreign_key :sprint_tasks, :tasks, column: :task_id, null: false

    add_index :sprint_tasks, :sprint_id
    add_index :sprint_tasks, :task_id
  end
end
