# frozen_string_literal: true

# Contains the data of an individual Board
# which can contain lists of tasks.
class DB::Board < ::ApplicationRecord
  include ::PgSearch::Model

  acts_as_paranoid double_tap_destroys_fully: false

  belongs_to :workspace
  has_many :lists, dependent: :destroy
  has_many :visible_lists, -> { visible(true) }, class_name: 'DB::List'
  has_many :invisible_lists, -> { visible(false) }, class_name: 'DB::List'
  has_many :lists_including_deleted, -> { with_deleted }, class_name: 'DB::List'
  has_many :deleted_lists, -> { only_deleted }, class_name: 'DB::List'
  has_many :tags
  has_many :sprints
  has_one :active_sprint, -> { where(end_date: nil) }, class_name: 'DB::Sprint'

  pg_search_scope :pg_search,
                  against: %i[name],
                  ignoring: :accents,
                  using: {
                    tsearch: {
                      prefix: true
                    }
                  }

  default_scope { order(:id) }

  validates :name, presence: true, length: { maximum: 50 }
  validates :colour, length: { minimum: 7, maximum: 9 }, allow_blank: true

  # @return [Array<DB::Task>]
  def tasks
    tasks = []
    lists_including_deleted.includes(:tasks_including_deleted).each do |list|
      list.tasks_including_deleted.each do |task|
        tasks << task
      end
    end
    tasks
  end
end
