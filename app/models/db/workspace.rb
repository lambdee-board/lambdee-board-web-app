# frozen_string_literal: true

# Contains the data of workspace
class DB::Workspace < ApplicationRecord
  has_many :boards

  validates :name, presence: true, length: { maximum: 50 }
end
