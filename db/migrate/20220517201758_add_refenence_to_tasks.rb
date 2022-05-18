class AddRefenenceToTasks < ActiveRecord::Migration[7.0]
  def change
    add_column :tasks, :author_id, :bigint, index: true
    add_foreign_key :tasks, :users, column: :author_id

    create_join_table :users, :tasks
  end
end
