class CreateScriptRuns < ActiveRecord::Migration[7.0]
  def change
    create_table :script_runs do |t|
      t.bigint :script_id
      t.text :output
      t.references :initiator, null: false, foreign_key: { to_table: :users }
    end
  end
end
