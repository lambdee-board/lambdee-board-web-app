class AddCustomDataToModels < ActiveRecord::Migration[7.0]
  def change
    add_column :boards, :custom_data, :jsonb
    add_column :lists, :custom_data, :jsonb
    add_column :sprint_tasks, :custom_data, :jsonb
    add_column :sprints, :custom_data, :jsonb
    add_column :tags, :custom_data, :jsonb
    add_column :users, :custom_data, :jsonb
    add_column :workspaces, :custom_data, :jsonb
  end
end
