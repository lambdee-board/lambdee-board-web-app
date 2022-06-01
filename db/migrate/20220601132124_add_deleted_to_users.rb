class AddDeletedToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :deleted, :boolean, default: false
  end
end
