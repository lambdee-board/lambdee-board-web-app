class AddStateToScriptRuns < ActiveRecord::Migration[7.0]
  def change
    add_column :script_runs, :state, :integer, limit: 1
  end
end
