class AddDeletedAtToTables < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :deleted_at, :datetime, index: true
    add_column :workspaces, :deleted_at, :datetime, index: true
    add_column :boards, :deleted_at, :datetime, index: true
    add_column :lists, :deleted_at, :datetime, index: true
    add_column :tasks, :deleted_at, :datetime, index: true
    add_column :comments, :deleted_at, :datetime, index: true
  end
end
