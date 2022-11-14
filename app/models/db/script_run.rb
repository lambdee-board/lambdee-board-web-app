# frozen_string_literal: true

class ::DB::ScriptRun < ::ApplicationRecord
  belongs_to :script
  belongs_to :initiator, class_name: '::DB::User'
end
