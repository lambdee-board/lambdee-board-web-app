# frozen_string_literal: true

# Contains the data of an individual Board
# which can contain lists of tasks.
class DB::Board < ::ApplicationRecord
  belongs_to :workspace
  has_many :lists
  has_many :visible_lists, -> { visible }, class_name: 'DB::List'
  has_many :archived_lists, -> { archived }, class_name: 'DB::List'
  has_many :tags

  scope :include_tasks, -> { includes(lists: { tasks: :users }) }

  scope :with_visible_tasks, -> { include_tasks.where(lists: { deleted: false }) }

  scope :with_archived_tasks, -> { include_tasks.where(lists: { deleted: true }) }

  # Module which overrides the `lists`
  # method so it does not execute a DB query.
  module EmptyLists
    # @return [Array]
    def lists
      []
    end
  end

  class << self
    alias_method :with_all_tasks, :include_tasks

    # @param id [Integer]
    # @return [self]
    def find_with_empty_lists(id)
      find(id).extend(EmptyLists)
    end

    # @param id [Integer]
    # @return [self]
    def find_with_visible_tasks(id)
      with_visible_tasks.first || find_with_empty_lists(id)
    end

    # @param id [Integer]
    # @return [self]
    def find_with_all_tasks(id)
      with_all_tasks.first || find_with_empty_lists(id)
    end

    # @param id [Integer]
    # @return [self]
    def find_with_archived_tasks(id)
      with_archived_tasks.first || find_with_empty_lists(id)
    end
  end

  validates :name, presence: true, length: { maximum: 50 }
  validates :colour, length: { minimum: 7, maximum: 9 }, allow_blank: true
end
