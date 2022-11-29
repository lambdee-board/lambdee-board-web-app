class AddDueTimeToTasks < ActiveRecord::Migration[7.0]
  def change
    add_column :tasks, :due_time, :datetime
  end
end
