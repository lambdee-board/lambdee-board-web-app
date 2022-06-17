class RemoveDeletedFromTables < ActiveRecord::Migration[7.0]
  def change
    remove_column :users, :deleted, :boolean
    remove_column :workspaces, :deleted, :boolean
    remove_column :lists, :deleted, :boolean
    remove_column :comments, :deleted, :boolean
  end
end
