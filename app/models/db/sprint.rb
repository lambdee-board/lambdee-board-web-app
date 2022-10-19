class DB::Sprint < ApplicationRecord
  has_many :sprint_tasks
  has_many :tasks, through: :sprint_tasks
  belongs_to :board
end
