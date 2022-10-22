class DB::Sprint < ApplicationRecord
  has_many :sprint_tasks, dependent: :destroy
  has_many :tasks, through: :sprint_tasks
  belongs_to :board
end
