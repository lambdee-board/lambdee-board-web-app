class AddCustomDataToTasks < ActiveRecord::Migration[7.0]
  def change
    add_column :tasks, :custom_data, :jsonb
    add_column :comments, :custom_data, :jsonb
  end
end
