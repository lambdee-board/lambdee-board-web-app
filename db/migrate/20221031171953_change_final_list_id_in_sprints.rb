class ChangeFinalListIdInSprints < ActiveRecord::Migration[7.0]
  def change
    remove_column :sprints, :final_list_id, :integer
    add_column :sprints, :final_list_name, :string
  end
end
