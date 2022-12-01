class AddDelayToScriptRuns < ActiveRecord::Migration[7.0]
  def change
    add_column :script_runs, :delay, :integer
  end
end
