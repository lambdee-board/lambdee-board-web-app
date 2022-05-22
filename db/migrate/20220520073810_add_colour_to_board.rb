class AddColourToBoard < ActiveRecord::Migration[7.0]
  def change
    add_column :boards, :colour, :string, limit: 9
  end
end
