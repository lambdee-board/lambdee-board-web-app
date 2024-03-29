# frozen_string_literal: true

# Contains the data of a list,
# which can contain multiple tasks.
class DB::List < ::ApplicationRecord
  include ::ScriptTriggerable
  include ::CustomDatable

  AVAILABLE_SCOPES = ::Set[:workspace, :board]

  acts_as_paranoid double_tap_destroys_fully: false

  belongs_to :board
  has_many :tasks, dependent: :destroy
  has_many :tasks_including_deleted, -> { with_deleted }, class_name: 'DB::Task'
  has_many :deleted_tasks, -> { only_deleted }, class_name: 'DB::Task'

  delegate :workspace, to: :board

  before_create :set_highest_pos_in_board

  default_scope { order(:id) }

  scope :visible, ->(visible) { where(visible:) }
  scope :pos_order, -> { reorder(pos: :asc) }

  scope :include_tasks, -> { includes(tasks: %i[tags users author]) }
  scope :include_tasks_containing_deleted, -> { includes(tasks_including_deleted: %i[tags users]) }
  scope :include_deleted_tasks, -> { includes(deleted_tasks: %i[tags users]) }
  scope(:include_user_tasks, lambda do |user|
    return self unless user

    include_tasks.where(users: { id: user.id })
  end)

  scope :find_with_tasks, ->(id) { include_tasks.find(id) }
  scope :find_with_tasks_including_deleted, ->(id) { include_tasks_containing_deleted.find(id) }
  scope :find_with_deleted_tasks, ->(id) { include_deleted_tasks.find(id) }

  validates :name, presence: true, length: { maximum: 50 }

  # Sets `pos` value to be the last in the list
  def set_highest_pos_in_board
    return unless board

    self.pos ||= board.lists.order(:pos).last&.pos&.+(1024) || 65_536
  end
end
