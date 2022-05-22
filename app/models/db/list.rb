# frozen_string_literal: true

# Contains the data of a list,
# which can contain multiple tasks.
class DB::List < ::ApplicationRecord
  include ::Archivable

  belongs_to :board
  has_many :tasks

  scope :include_tasks, -> { includes(tasks: :users) }
  scope :with_visible_tasks, -> { include_tasks.where(deleted: false) }
  scope :with_archived_tasks, -> { include_tasks.where(deleted: true) }

  scope :find_with_all_tasks, ->(id) { with_all_tasks.find(id) }
  scope :find_with_visible_tasks, ->(id) { with_visible_tasks.find(id) }
  scope :find_with_archived_tasks, ->(id) { with_archived_tasks.find(id) }

  class << self
    alias_method :with_all_tasks, :include_tasks
  end

  validates :name, presence: true, length: { maximum: 50 }
end
