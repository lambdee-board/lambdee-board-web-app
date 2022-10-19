class CreateDBSprints < ActiveRecord::Migration[7.0]
  def change
    create_table :sprints do |t|
      t.string :name
      t.datetime :start_date
      t.datetime :due_date
      t.datetime :end_date
    end
  end
end
