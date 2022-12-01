class AddDelayToScriptTriggers < ActiveRecord::Migration[7.0]
  def change
    add_column :script_triggers, :delay, :integer
  end
end
