# frozen_string_literal: true

# Contains the data of a workspace,
# which can contain multiple boards.
class DB::Workspace < ApplicationRecord
  has_many :boards

  validates :name, presence: true, length: { maximum: 40 }
end
