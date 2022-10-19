class DB::SprintTask < ApplicationRecord
  belongs_to :sprints
  belongs_to :tasks
end
