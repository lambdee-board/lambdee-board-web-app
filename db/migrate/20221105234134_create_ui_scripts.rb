class CreateUiScripts < ActiveRecord::Migration[7.0]
  def change
    create_table :ui_scripts do |t|
      t.bigint :script_id
      t.references :subject, polymorphic: true
      t.references :scope, polymorphic: true
    end
  end
end
