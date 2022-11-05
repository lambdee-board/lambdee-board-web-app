class AddDescriptionToSprints < ActiveRecord::Migration[7.0]
  def change
    add_column :sprints, :description, :text
  end
end
