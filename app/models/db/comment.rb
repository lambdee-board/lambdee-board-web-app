# frozen_string_literal: true

# Contains the data of an individual Comment
class DB::Comment < ApplicationRecord
  include ::Archivable

  belongs_to :author, class_name: 'DB::User', foreign_key: :author_id
  belongs_to :task

  validates :body,  length: { maximum: 500 }
end
