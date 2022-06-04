# frozen_string_literal: true

# Contains the data of an individual Comment
class DB::Comment < ApplicationRecord
  include ::Archivable

  belongs_to :author, class_name: 'DB::User', foreign_key: :author_id
  belongs_to :task

  default_scope { order(id: :desc) }

  scope :include_author, -> { includes(:author) }
  scope :visible, -> { where(deleted: false) }
  scope :archived, -> { where(deleted: true) }

  scope :find_with_author, ->(id) { include_author.find(id) }
  scope :find_with_author_for_task, ->(id) { include_author.where(task_id: id) }
  scope :find_for_task, ->(id) { where(task_id: id) }

  validates :body,  length: { maximum: 500 }
end
