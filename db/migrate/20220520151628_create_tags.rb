class CreateTags < ActiveRecord::Migration[7.0]
  def change
    create_table :tags do |t|
      t.string :name
      t.string :colour, limit: 9
      t.references :board, null: false, foreign_key: true

      t.timestamps
    end
  end
end
