class AddDefaultValueInComments < ActiveRecord::Migration[7.0]
  def change
    change_column :comments, :deleted, :boolean, default: false
  end
end
