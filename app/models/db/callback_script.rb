# frozen_string_literal: true

class DB::CallbackScript < ApplicationRecord
  belongs_to :subject, polymorphic: true
  belongs_to :script
end
