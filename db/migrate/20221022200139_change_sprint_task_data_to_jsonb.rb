class ChangeSprintTaskDataToJsonb < ActiveRecord::Migration[7.0]
  def change
    change_column :sprint_tasks, :data, 'jsonb USING CAST(data AS jsonb)'
  end
end
