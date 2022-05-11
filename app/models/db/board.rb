# frozen_string_literal: true

# Contains the data of board
class DB::Board < ApplicationRecord
  belongs_to :workspace

  validates :name, presence: true, length: { maximum: 50 }
end
