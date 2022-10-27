# frozen_string_literal: true

class DB::SprintTask < ApplicationRecord
  belongs_to :sprint
  belongs_to :task
end
