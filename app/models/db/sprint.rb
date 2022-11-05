# frozen_string_literal: true

require 'debug'
# Contains the data of a sprint
class DB::Sprint < ApplicationRecord
  has_many :sprint_tasks, dependent: :destroy
  has_many :tasks, -> { with_deleted }, through: :sprint_tasks
  belongs_to :board

  validates :name, presence: true, length: { maximum: 40 }
  validates :final_list_name, presence: true, length: { maximum: 255 }
  validates :start_date, :due_date, presence: true
  validate :final_list_name_uniqueness
  validate :only_one_active_sprint

  before_validation :set_final_list_name
  after_create :add_tasks

  # @return [Array<DB::Board>]
  def lists
    board.lists.visible(true)
  end

  # @return [Boolean, nil]
  def end
    return if end_date

    completed_tasks = board.lists.find_by(name: final_list_name)&.tasks
    completed_tasks&.destroy_all
    self.end_date = ::Time.now
    save(validate: false)
  end

  # @return [Array]
  def burnup_chart_data
    [
      {
        name: 'Work Scope',
        data: points_in_sprint
      },
      {
        name: 'Completed work',
        data: {
          (Time.now - 1.week) => 0,
          (Time.now - 1.week + 1.hour) => 2,
          (Time.now - 1.week + 4.hour) => 3,
          (Time.now - 1.week + 14.hour) => 5,
          (Time.now - 1.week + 24.hour) => 10,
          (Time.now - 1.week + 30.hour) => 15,
          (Time.now - 1.week + 35.hour) => 20,
          (Time.now - 1.week + 48.hour) => 21,
          (Time.now - 3.days) => 22
        }
      }
    ]
  end

  # @return [Hash]
  def points_in_sprint
    result = {}
    sum = 0
    sprint_tasks.order(:add_date).includes(:task).each do |st|
      start_date = st.start_date.to_date.to_s
      result[start_date] = sum += st.task.points
    end
    result[due_date.to_s] = tasks.each.sum(&:points)
    result
  end

  def completed_work
    # final_list_name = final_list.name
    # result = {}
    # sprint_tasks.includes(:task).each do |st|
    #   end_date = st.data.last['date'].to_time.change(usec: 0).to_s
    #   result[start_date] = sum += st.task.points
    # end
    # result
  end

  private

  def final_list_name_uniqueness
    errors.add(:final_list_name, 'is not unique') if lists.where(name: final_list_name).count > 1
  end

  def only_one_active_sprint
    errors.add(:board, 'already has an active sprint') if board.active_sprint
  end

  def set_final_list_name
    self.final_list_name ||= board.lists.visible(true).pos_order.last&.name
  end

  def add_tasks
    lists.includes(:tasks).each do |list|
      list.tasks.each do |task|
        sprint_task = ::DB::SprintTask.new(
          task: task,
          sprint: self
        )
        sprint_task.build_start_params
        sprint_task.save
      end
    end
  end
end
