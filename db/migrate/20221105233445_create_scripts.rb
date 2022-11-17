class CreateScripts < ActiveRecord::Migration[7.0]
  def change
    create_table :scripts do |t|
      t.text :content
      t.string :name
      t.text :description
      t.references :author, null: false, foreign_key: { to_table: :users }
    end
  end
end
