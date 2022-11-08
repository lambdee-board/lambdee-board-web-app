class AddDefaultSprintStartTime < ActiveRecord::Migration[7.0]
  def change
    change_column :sprints, :started_at, :datetime, default: -> { 'CURRENT_TIMESTAMP' }
  end
end
