# frozen_string_literal: true

class ::DB::ScriptRun < ::ApplicationRecord
  belongs_to :script
  belongs_to :initiator, class_name: '::DB::User'

  default_scope { order(:id) }

  enum state: { waiting: 0, running: 1, executed: 2, failed: 3, timed_out: 4, connection_failed: 5 }
end
