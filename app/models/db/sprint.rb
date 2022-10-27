# frozen_string_literal: true

class DB::Sprint < ApplicationRecord
  has_many :sprint_tasks, dependent: :destroy
  has_many :tasks, through: :sprint_tasks
  belongs_to :board

  validates :name, presence: true, length: { maximum: 40 }
  validates :start_date, presence: true
  validates :due_date, presence: true
end
