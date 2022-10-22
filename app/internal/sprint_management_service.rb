# frozen_string_literal: true

# Creates and manages sprints.
class SprintManagementService
  # @param sprint [DB::Sprint]
  def initialize(sprint, board_id = nil, task_id = nil)
    @sprint = sprint
    @board = DB::Board.find(board_id) unless board_id.nil?
    @task = DB::Task.find(task_id) unless task_id.nil?
  end

  def create
    @sprint.board = @board
    lists = @board.lists.visible(true).includes(:tasks)

    lists.each do |list|
      list.tasks.each do |task|
        DB::SprintTask.new(
          task:,
          sprint: @sprint,
          data: [{ state: list.name, date: Time.now }]
        ).save
      end
    end
    @sprint.save
  end

  def set_task_state
    sprint_task = DB::SprintTask.find(sprint:, task:)
    sprint_task.data << { state: @task.list.name, date: Time.now }
    sprint_task.save
  end
end
