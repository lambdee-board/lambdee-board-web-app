class RemoveTimestampsFromUserWorkspaces < ActiveRecord::Migration[7.0]
  def change
    remove_column :user_workspaces, :created_at, :string
    remove_column :user_workspaces, :updated_at, :string
  end
end
