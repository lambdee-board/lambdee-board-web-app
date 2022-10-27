# frozen_string_literal: true

# Creates and manages sprints.
class SprintManagementService
  # @param sprint [DB::Sprint]
  def initialize(sprint, board = nil, task = nil)
    @sprint = sprint
    @board = board unless board.nil?
    @task = task unless task.nil?
  end

  # Creates DB::Sprint and DB::SprintTasks associated with it
  # DB::SprintTask state is saved in following JSON format:
  #
  #      {
  #        "final_state": DB::List.name, # name of last list in board
  #        "transitions":[
  #          {
  #            "state": DB::List.name, # list to which we put this task
  #            "date": Time.now # timestamp when action was performed
  #          },
  #          {...}
  #        ]
  #      {
  #
  # @return [Boolean, nil] Returns bool that represents if creation was successful
  def create
    return unless @board.active_sprint.nil?

    lists = @board.lists.visible(true).includes(:tasks)
    final_state = lists.order(:pos).last.name

    lists.each do |list|
      list.tasks.each do |task|
        DB::SprintTask.new(
          task:,
          sprint: @sprint,
          data: { final_state:, transitions: [{ state: list.name, date: Time.now }] }
        ).save
      end
    end
    @sprint.save
  end

  # Saves new task state (list to which task was moved to)
  #
  # @param new_list [DB::List]
  # @return [Boolean, nil]
  def new_task_state(new_list)
    sprint_task = DB::SprintTask.where(sprint: @sprint, task: @task).last
    return unless sprint_task.present?

    sprint_task.data['transitions'] << { state: new_list.name, date: Time.now }
    sprint_task.save
  end
end
