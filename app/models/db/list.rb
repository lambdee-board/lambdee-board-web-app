# frozen_string_literal: true

# Contains the data of a list,
# which can contain multiple tasks.
class DB::List < ApplicationRecord
  include Archivable

  belongs_to :board
  has_many :tasks

  validates :name, presence: true, length: { maximum: 50 }
end
