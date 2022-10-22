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

  def set_task_state
    sprint_task = DB::SprintTask.where(sprint: @sprint, task: @task)
    return false unless sprint_task.empty?

    sprint_task.data << { state: @task.list.name, date: Time.now }
    sprint_task.save
  end

  def end
    return false unless @sprint.end_date.nil?

    completed_tasks = @sprint.board.lists.order(:pos).last.tasks
    completed_tasks.destroy_all
    @sprint.end_date = Time.now
    @sprint.save
  end
end
