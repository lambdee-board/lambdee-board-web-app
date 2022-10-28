# frozen_string_literal: true

# Contains the data of a task,
# which can contain multiple comments.
class DB::Task < ApplicationRecord
  acts_as_paranoid double_tap_destroys_fully: false

  belongs_to :list
  belongs_to :author, -> { with_deleted }, class_name: 'DB::User', foreign_key: :author_id
  has_many :comments, dependent: :destroy
  has_many :comments_including_deleted, -> { with_deleted }, class_name: 'DB::Comment'
  has_many :deleted_comments, -> { only_deleted }, class_name: 'DB::Comment'
  has_many :task_users, class_name: 'DB::TaskUser', dependent: :destroy
  has_many :task_tags, class_name: 'DB::TaskTag', dependent: :destroy
  has_many :users, through: :task_users
  has_many :tags, through: :task_tags
  has_many :sprint_tasks
  has_many :sprints, through: :sprint_tasks

  before_create :set_highest_pos_in_list

  default_scope { order(:id) }

  scope :for_list, ->(id) { where(list_id: id) }
  scope :pos_order, -> { reorder(pos: :asc) }
  scope :include_associations, -> { includes(:list, :author, :users, :tags) }
  scope :with_users_and_tags, -> { includes(:users, :tags) }
  scope :find_with_all_associations, ->(id) { with_all_associations.find(id) }

  enum priority: {
    very_low: 0,
    low: 1,
    medium: 2,
    high: 3,
    very_high: 4
  }

  validates :name, presence: true, length: { maximum: 80 }
  validates :description, length: { maximum: 10_000 }
  validates :points, numericality: { in: 0..99 }, allow_blank: true

  class << self
    alias with_all_associations include_associations
  end

  # @return [Array<DB::User>]
  def assignees
    users
  end

  # @return [DB::Board]
  def board
    list.board
  end

  # Sets `pos` value to be the last in the list
  def set_highest_pos_in_list
    return unless list

    self.pos ||= list.tasks.order(:pos).last&.pos&.+(1024) || 65_536
  end

  # Saves new task state (list to which task was moved to)
  #
  # @return [Boolean, nil]
  def new_task_state(list_id)
    return unless list.id != list_id

    new_list = ::DB::List.find list_id
    sprint_task = sprint_tasks.find_by sprint: board.active_sprint

    sprint_task.data << { state: new_list.name, date: ::Time.now }
    sprint_task.save(validate: false)
  end
end
