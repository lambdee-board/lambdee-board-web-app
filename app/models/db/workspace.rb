# frozen_string_literal: true

class DB::Workspace < ApplicationRecord
  validates :name, presence: true, length: { maximum: 50 }
end
