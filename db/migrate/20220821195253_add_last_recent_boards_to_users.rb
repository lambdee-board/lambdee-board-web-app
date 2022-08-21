class AddLastRecentBoardsToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :recent_boards, :text, array: true, default: []
  end
end
