# frozen_string_literal: true

# Contains the data of an individual Board
# which can contain lists of tasks.
class DB::Board < ::ApplicationRecord
  belongs_to :workspace
  has_many :lists

  scope :find_with_preloaded_tasks, (lambda do |id|
    includes(lists: { tasks: :users }).where(lists: { deleted: false }).find(id)
  end)

  validates :name, presence: true, length: { maximum: 50 }
end
