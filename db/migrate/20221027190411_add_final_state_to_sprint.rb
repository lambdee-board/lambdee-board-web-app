class AddFinalStateToSprint < ActiveRecord::Migration[7.0]
  def change
    add_column :sprints, :final_list_id, :integer
  end
end
