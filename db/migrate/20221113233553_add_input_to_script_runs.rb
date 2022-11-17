class AddInputToScriptRuns < ActiveRecord::Migration[7.0]
  def change
    add_column :script_runs, :input, :text
  end
end
