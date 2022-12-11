class AddTimefieldsToScriptRuns < ActiveRecord::Migration[7.0]
  def change
    add_column :script_runs, :triggered_at, :datetime
    add_column :script_runs, :executed_at, :datetime
  end
end
