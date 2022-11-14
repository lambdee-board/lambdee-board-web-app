class ChangeTableNames < ActiveRecord::Migration[7.0]
  def change
    drop_table :callback_scripts
    drop_table :ui_scripts
    create_table :script_triggers do |t|
      t.bigint :script_id
      t.references :subject, polymorphic: true
      t.string :action
    end
    create_table :ui_script_triggers do |t|
      t.bigint :script_id
      t.references :subject, polymorphic: true
      t.references :scope, polymorphic: true
    end
  end
end
