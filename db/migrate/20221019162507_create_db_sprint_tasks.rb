class CreateDBSprintTasks < ActiveRecord::Migration[7.0]
  def change
    create_table :sprint_tasks do |t|
      t.integer :task_id
      t.integer :sprint_id
      t.string :data
    end
  end
end
