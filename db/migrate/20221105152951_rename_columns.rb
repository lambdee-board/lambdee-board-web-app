class RenameColumns < ActiveRecord::Migration[7.0]
  def change
    rename_column :sprint_tasks, :add_date, :added_at
    rename_column :sprint_tasks, :completion_date, :completed_at

    rename_column :sprints, :start_date, :started_at
    rename_column :sprints, :due_date, :expected_end_at
    rename_column :sprints, :end_date, :ended_at
  end
end
