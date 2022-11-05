class EditSprintTasksTable < ActiveRecord::Migration[7.0]
  def change
    remove_column :sprint_tasks, :data, :string
    add_column :sprint_tasks, :add_date, :datetime
    add_column :sprint_tasks, :completion_date, :datetime
    add_column :sprint_tasks, :start_state, :string
    add_column :sprint_tasks, :state, :string
  end
end
