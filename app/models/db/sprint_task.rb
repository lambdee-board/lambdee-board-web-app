class DB::SprintTask < ApplicationRecord
  belongs_to :sprint
  belongs_to :task

  serialize :data, JSON
end
