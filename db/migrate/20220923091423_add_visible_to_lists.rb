class AddVisibleToLists < ActiveRecord::Migration[7.0]
  def change
    add_column :lists, :visible, :boolean, default: false
  end
end
