# frozen_string_literal: true

# Contains the data of application user
class DB::User < ApplicationRecord
  validates :name, presence: true, length: { maximum: 50 }
end
