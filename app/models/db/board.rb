# frozen_string_literal: true

# Contains the data of an individual Board
# which can contain lists of tasks.
class DB::Board < ::ApplicationRecord
  belongs_to :workspace

  validates :name, presence: true, length: { maximum: 50 }
end
