# frozen_string_literal: true

# Contains the data of an individual Comment
class DB::Comment < ApplicationRecord
  acts_as_paranoid double_tap_destroys_fully: false

  belongs_to :author, -> { with_deleted }, class_name: 'DB::User', foreign_key: :author_id
  belongs_to :task

  default_scope { order(id: :desc) }

  scope :find_with_author_for_task, ->(id) { includes(:author).where(task_id: id) }
  scope :find_for_task, ->(id) { where(task_id: id) }

  validates :body,  length: { maximum: 500 }
end
