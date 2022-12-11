# frozen_string_literal: true

# Sends single script content to the Script Service.
class ::ExecuteScriptJob < ::ApplicationJob
  queue_as :default

  # @param script_run_id [String, Integer]
  def perform(script_run_id)
    script_run = ::DB::ScriptRun.find(script_run_id)
    script_run.executed_at = ::Time.now
    script_run.running!
    ::ScriptServiceAPI.send_execute_script_request(script_run)
  end
end
