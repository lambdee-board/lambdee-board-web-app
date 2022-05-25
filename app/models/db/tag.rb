# frozen_string_literal: true

# Contains the data of an individual Tag which
# belongs to Board and can be assigned to many tasks
class DB::Tag < ApplicationRecord
  belongs_to :board
  has_and_belongs_to_many :tasks

  validates :name, length: { maximum: 30 }
  validates :colour, length: { minimum: 7, maximum: 9 }, allow_blank: true
end
