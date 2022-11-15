# frozen_string_literal: true

# Contains the data of an individual Tag which
# belongs to Board and can be assigned to many tasks
class DB::Tag < ApplicationRecord
  include ::ScriptTriggerable

  belongs_to :board
  has_many :task_tags, class_name: 'DB::TaskTag', dependent: :destroy
  has_many :tasks, through: :task_tags

  default_scope { order(:id) }

  scope :for_board, ->(id) { where(board: id) }

  validates :name, length: { maximum: 30 }
  validates :colour, length: { minimum: 7, maximum: 9 }, allow_blank: true
end
