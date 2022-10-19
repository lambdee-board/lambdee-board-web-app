class AddIdToJoinTables < ActiveRecord::Migration[7.0]
  def change
    add_column :tasks_users, :id, :primary_key
    add_column :tags_tasks, :id, :primary_key
  end
end
