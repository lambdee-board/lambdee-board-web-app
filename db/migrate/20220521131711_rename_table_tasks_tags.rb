class RenameTableTasksTags < ActiveRecord::Migration[7.0]
  def change
    drop_table :tasks_tags
    create_join_table :tags, :tasks
  end
end
