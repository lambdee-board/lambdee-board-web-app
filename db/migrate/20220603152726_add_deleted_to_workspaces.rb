class AddDeletedToWorkspaces < ActiveRecord::Migration[7.0]
  def change
    add_column :workspaces, :deleted, :boolean, default: false
  end
end
