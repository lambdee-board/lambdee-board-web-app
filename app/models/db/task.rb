# frozen_string_literal: true

# Contains the data of a task,
# which can contain multiple comments.
class DB::Task < ApplicationRecord
  belongs_to :list
  belongs_to :author, class_name: 'DB::User', foreign_key: :author_id
  has_and_belongs_to_many :users

  validates :name, presence: true, length: { maximum: 80 }
  validates :description, length: { maximum: 300 }
end
