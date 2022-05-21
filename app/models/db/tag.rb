# frozen_string_literal: true

# Contains the data of an individual Tag which
# belongs to Board and can be assigned to many tasks
class DB::Tag < ApplicationRecord
  belongs_to :board
end
