# frozen_string_literal: true

class DB::Sprint < ApplicationRecord
  has_many :sprint_tasks, dependent: :destroy
  has_many :tasks, through: :sprint_tasks
  belongs_to :board

  validates :name, presence: true, length: { maximum: 40 }
  validates :start_date, presence: true
  validates :due_date, presence: true

  # @return [Boolean, nil]
  def end
    return unless end_date.nil?

    completed_tasks = board.lists.order(:pos).last.tasks # to poprawić
    completed_tasks.destroy_all
    self.end_date = ::Time.now
    save(validate: false)
  end
end
