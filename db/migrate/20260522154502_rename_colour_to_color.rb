class RenameColourToColor < ActiveRecord::Migration[7.2]
  def change
    rename_column :boards, :colour, :color
    rename_column :tags, :colour, :color
    rename_column :ui_script_triggers, :colour, :color
  end
end
