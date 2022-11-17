# frozen_string_literal: true

# Contains the data about task in certain sprint
class ::DB::SprintTask < ::ApplicationRecord
  include ::ScriptTriggerable
  include ::CustomDatable

  belongs_to :sprint
  belongs_to :task, -> { with_deleted }

  before_save :set_completion_time

  # @param list [DB::List, nil]
  def build_start_params(list = nil)
    list_name = list&.name || task.list.name
    self.start_state = list_name
    self.state = list_name
    self.added_at = ::Time.now
  end

  # @return [Date]
  def addition_date
    added_at.to_date
  end

  # @return [Date]
  def completion_date
    completed_at.to_date
  end

  private

  def set_completion_time
    self.completed_at = ::Time.now if state == sprint.final_list_name
  end
end
