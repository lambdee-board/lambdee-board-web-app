# frozen_string_literal: true

class DB::Script < ApplicationRecord
  has_many :script_run, dependent: :destroy
  has_many :callback_script, dependent: :destroy
  has_many :ui_script, dependent: :destroy
end
