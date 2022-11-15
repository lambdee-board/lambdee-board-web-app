class CreateCallbackScripts < ActiveRecord::Migration[7.0]
  def change
    create_table :callback_scripts do |t|
      t.bigint :script_id
      t.references :subject, polymorphic: true
      t.string :action
    end
  end
end
