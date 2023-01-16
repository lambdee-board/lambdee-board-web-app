# frozen_string_literal: true

class CreateDBScriptVariables < ::ActiveRecord::Migration[7.0]
  def change
    create_table :script_variables do |t|
      t.references :owner, polymorphic: true
      t.string :name, index: { unique: true }
      t.string :description
      t.string :value
      t.timestamps
    end

    add_index :script_variables, %i[owner_type owner_id name], unique: true, name: 'unique_name_per_owner'
  end
end
