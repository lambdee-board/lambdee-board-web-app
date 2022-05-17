class CreateDBUserWorkspaces < ActiveRecord::Migration[7.0]
  def change
    create_table :user_workspaces do |t|
      t.references :user, null: false, foreign_key: true
      t.references :workspace, null: false, foreign_key: true

      t.timestamps
    end
  end
end
