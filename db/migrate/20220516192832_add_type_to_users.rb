class AddTypeToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :type, :integer
    add_index :users, :type
  end
end
