class AddAssociationToBoard < ActiveRecord::Migration[7.0]
  def change
    add_reference :boards, :workspace, index: true
  end
end
