# frozen_string_literal: true

class ::DB::ScriptRun < ::ApplicationRecord
  belongs_to :script
  belongs_to :initiator, class_name: '::DB::User'

  enum state: { running: 0, executed: 1, failed: 2, timed_out: 3, connection_failed: 4 }
end
