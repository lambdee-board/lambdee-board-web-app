class AddAssociationBoardToSprint < ActiveRecord::Migration[7.0]
  def change
    add_reference :sprints, :board, index: true
  end
end
