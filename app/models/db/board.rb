# frozen_string_literal: true

# Contains the data of an individual Board
# which can contain lists of tasks.
class DB::Board < ::ApplicationRecord
  acts_as_paranoid double_tap_destroys_fully: false

  belongs_to :workspace
  has_many :lists, dependent: :destroy
  has_many :visible_lists, -> { visible(true) }, class_name: 'DB::List'
  has_many :invisible_lists, -> { visible(false) }, class_name: 'DB::List'
  has_many :lists_including_deleted, -> { with_deleted }, class_name: 'DB::List'
  has_many :deleted_lists, -> { only_deleted }, class_name: 'DB::List'
  has_many :tags
  has_many :sprints
  has_one :active_sprint, -> { where.not(end_date: nil) }, class_name: 'DB::Sprint'

  default_scope { order(:id) }

  validates :name, presence: true, length: { maximum: 50 }
  validates :colour, length: { minimum: 7, maximum: 9 }, allow_blank: true
end
