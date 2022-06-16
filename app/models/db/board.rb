# frozen_string_literal: true

# Contains the data of an individual Board
# which can contain lists of tasks.
class DB::Board < ::ApplicationRecord
  acts_as_paranoid double_tap_destroys_fully: false

  belongs_to :workspace
  has_many :lists, dependent: :destroy
  has_many :visible_lists, -> { visible }, class_name: 'DB::List'
  has_many :archived_lists, -> { archived }, class_name: 'DB::List'
  has_many :tags

  scope :include_tasks, -> { includes(lists: { tasks: %i[tags users] }) }
  scope :with_visible_tasks, -> { include_tasks.where(lists: { deleted: false }) }
  scope :with_archived_tasks, -> { include_tasks.where(lists: { deleted: true }) }

  scope :include_lists, -> { includes(:lists) }
  scope :with_visible_lists, -> { include_lists.where(lists: { deleted: false }) }
  scope :with_archived_lists, -> { include_lists.where(lists: { deleted: true }) }

  validates :name, presence: true, length: { maximum: 50 }
  validates :colour, length: { minimum: 7, maximum: 9 }, allow_blank: true

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
    alias_method :with_all_lists, :include_lists

    # @param id [Integer]
    # @return [self]
    def find_with_empty_lists(id)
      find(id).extend(EmptyLists)
    end

    # @param id [Integer]
    # @return [self]
    def find_with_visible_tasks(id)
      with_visible_tasks.where(id: id).first || find_with_empty_lists(id)
    end

    # @param id [Integer]
    # @return [self]
    def find_with_all_tasks(id)
      with_all_tasks.where(id: id).first || find_with_empty_lists(id)
    end

    # @param id [Integer]
    # @return [self]
    def find_with_archived_tasks(id)
      with_archived_tasks.where(id: id).first || find_with_empty_lists(id)
    end

    # @param id [Integer]
    # @return [self]
    def find_with_visible_lists(id)
      with_visible_lists.where(id: id).first || find_with_empty_lists(id)
    end

    # @param id [Integer]
    # @return [self]
    def find_with_all_lists(id)
      with_all_lists.where(id: id).first || find_with_empty_lists(id)
    end

    # @param id [Integer]
    # @return [self]
    def find_with_archived_lists(id)
      with_archived_lists.where(id: id).first || find_with_empty_lists(id)
    end
  end
end
