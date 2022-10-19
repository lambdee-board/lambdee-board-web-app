class AddTimeToTasks < ActiveRecord::Migration[7.0]
  def change
    add_column :tasks, :spent_time, :integer, default: 0
    add_column :tasks, :start_time, :datetime
  end
end
