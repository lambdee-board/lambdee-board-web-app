# frozen_string_literal: true

# Contains the data about task in certain sprint
class ::DB::SprintTask < ::ApplicationRecord
  belongs_to :sprint
  belongs_to :task

  before_save :set_completion_date

  # @param list [DB::List, nil]
  def build_start_params(list = nil)
    list_name = list&.name || task.list.name
    self.start_state = list_name
    self.state = list_name
    self.add_date = ::Time.now
  end

  private

  def set_completion_date
    self.completion_date = ::Time.now if state == sprint.final_list_name
  end
end
