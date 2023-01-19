# frozen_string_literal: true

# Contains the data about task in certain sprint
class ::DB::SprintTask < ::ApplicationRecord
  include ::CustomDatable

  belongs_to :sprint
  belongs_to :task, -> { with_deleted }

  before_save :set_or_remove_completion_time

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

  def set_or_remove_completion_time
    return unless state_changed?

    self.completed_at = state == sprint.final_list_name ? ::Time.now : nil
  end
end
