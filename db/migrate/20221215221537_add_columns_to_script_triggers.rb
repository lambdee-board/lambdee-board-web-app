class AddColumnsToScriptTriggers < ActiveRecord::Migration[7.0]
  def change
    change_table :script_triggers do |t|
      t.references :scope, polymorphic: true
      t.references :author, foreign_key: { to_table: :users }
      t.boolean :private
    end

    change_table :ui_script_triggers do |t|
      t.references :author, foreign_key: { to_table: :users }
      t.integer :delay
      t.boolean :private
      t.string :colour, limit: 9
      t.string :text, limit: 100
    end
  end
end
