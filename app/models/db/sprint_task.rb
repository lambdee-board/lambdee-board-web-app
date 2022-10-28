# frozen_string_literal: true

# Contains the data about task in certain sprint
class DB::SprintTask < ApplicationRecord
  belongs_to :sprint
  belongs_to :task
end
