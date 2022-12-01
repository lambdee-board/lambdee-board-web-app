# frozen_string_literal: true

# Allows triggering the callback scripts.
module ::ScriptTriggerable
  extend ::ActiveSupport::Concern

  included do
    attr_reader :previous_object_state

    after_validation :save_previous_object_state
    after_create { execute_scripts_with_action(:create) }
    after_update { execute_scripts_with_action(:update) }
    after_destroy { execute_scripts_with_action(:destroy) }
  end

  private

  def save_previous_object_state
    @previous_object_state = as_json.merge(attributes_in_database)
  end

  def execute_scripts_with_action(action)
    script_triggers = script_triggers_regarding_record.with_action(action).includes(:script)
    script_triggers.each { |c| c.script.execute(self, delay: c.delay) }
  end

  def script_triggers_regarding_record
    ::DB::ScriptTrigger.regarding_record(self)
  end
end
