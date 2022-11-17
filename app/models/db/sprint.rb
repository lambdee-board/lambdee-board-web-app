# frozen_string_literal: true

# Contains the data of a sprint
class DB::Sprint < ApplicationRecord
  include ::ScriptTriggerable
  include ::CustomDatable
  include ::Charts::BurnUpChart

  has_many :sprint_tasks, dependent: :destroy
  has_many :tasks, -> { with_deleted }, through: :sprint_tasks
  belongs_to :board

  validates :name, presence: true, length: { maximum: 40 }
  validates :final_list_name, presence: true, length: { maximum: 255 }
  validates :expected_end_at, presence: true
  validate :final_list_name_uniqueness
  validate :only_one_active_sprint

  before_validation :set_final_list_name
  after_create :add_tasks

  attribute :started_at, default: -> { ::Time.now }

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

  private

  def final_list_name_uniqueness
    errors.add(:final_list_name, 'is not unique') if lists.where(name: final_list_name).count > 1
  end

  def only_one_active_sprint
    errors.add(:board, 'already has an active sprint') if board.active_sprint && board.active_sprint != self
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
