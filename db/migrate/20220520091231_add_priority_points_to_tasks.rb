class AddPriorityPointsToTasks < ActiveRecord::Migration[7.0]
  def change
    add_column :tasks, :priority, :integer
    add_column :tasks, :points, :integer
  end
end
