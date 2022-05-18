class AddIndexToTaskTable < ActiveRecord::Migration[7.0]
  def change
    add_index :tasks, :author_id
  end
end
