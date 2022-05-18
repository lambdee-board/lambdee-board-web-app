class CreateLists < ActiveRecord::Migration[7.0]
  def change
    create_table :lists do |t|
      t.string :name
      t.float :pos
      t.boolean :deleted, default: false
      t.references :board, null: false, foreign_key: true

      t.timestamps
    end
  end
end
