class CreateTasksTags < ActiveRecord::Migration[7.0]
  def change
    create_table :tasks_tags, id: false do |t|
      t.belongs_to :task
      t.belongs_to :tag
    end
  end
end
