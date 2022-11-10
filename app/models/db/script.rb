# frozen_string_literal: true

class DB::Script < ApplicationRecord
  has_many :script_runs, dependent: :destroy
  has_many :callback_scripts, dependent: :destroy
  has_many :ui_scripts, dependent: :destroy
end
