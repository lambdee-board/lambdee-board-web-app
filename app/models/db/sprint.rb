# frozen_string_literal: true

require 'debug'
# Contains the data of a sprint
class DB::Sprint < ApplicationRecord
  has_many :sprint_tasks, dependent: :destroy
  has_many :tasks, -> { with_deleted }, through: :sprint_tasks
  belongs_to :board

  validates :name, presence: true, length: { maximum: 40 }
  validates :final_list_name, presence: true, length: { maximum: 255 }
  validates :started_at, :expected_end_at, presence: true
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
    return if ended_at

    completed_tasks = board.lists.find_by(name: final_list_name)&.tasks
    completed_tasks&.destroy_all
    self.ended_at = ::Time.now
    save(validate: false)
  end

  # @return [Array]
  def burnup_chart_data
    [
      {
        name: 'Work Scope',
        data: points_in_sprint_in_time
      },
      {
        name: 'Completed work',
        data: completed_work
      }
    ]
  end

  # @return [Hash]
  def points_in_sprint_in_time
    result = dates_hash.dup
    sum = 0
    sprint_tasks.order(:added_at).includes(:task).each do |st|
      start_date = st.addition_date.to_s
      sum += st.task.points if st.task.points
      result[start_date] = sum
    end
    result[expected_end_at.to_date.to_s] = tasks.each.sum { |t| t.points.to_i }

    last_points = result.first.second
    result.transform_values! do |points|
      points ||= last_points
      last_points = points
    end

    result
  end

  # @return [Hash]
  def completed_work
    result = dates_hash.dup
    sum = 0
    sprint_tasks.order(:completed_at).includes(:task).each do |st|
      next unless st.completed_at

      end_date = st.completion_date.to_s
      sum += st.task.points if st.task.points
      result[end_date] = sum
    end

    last_points = result.first.second
    result.transform_values! do |points|
      points ||= last_points
      last_points = points
    end

    result
  end

  # @return [Hash]
  def dates_hash
    return @result if @result

    @result = {}
    sprint_tasks.each do |st|
      @result[st.addition_date.to_s] = nil
      next unless st.completed_at

      @result[st.completion_date.to_s] = nil
    end
    @result
  end

  private

  def final_list_name_uniqueness
    errors.add(:final_list_name, 'is not unique') if lists.where(name: final_list_name).count > 1
  end

  def only_one_active_sprint
    errors.add(:board, 'already has an active sprint') if board.active_sprint
  end

  def set_final_list_name
    self.final_list_name ||= board.lists.visible(true).pos_order.last&.name || 'Done'
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
