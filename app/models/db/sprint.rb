# frozen_string_literal: true

require 'debug'
# Contains the data of a sprint
class DB::Sprint < ApplicationRecord
  has_many :sprint_tasks, dependent: :destroy
  has_many :tasks, through: :sprint_tasks
  belongs_to :final_list, class_name: 'DB::List', foreign_key: :final_list_id
  belongs_to :board

  validates :name, presence: true, length: { maximum: 40 }
  validates :start_date, presence: true
  validates :due_date, presence: true

  # Creates a snapshot of tasks state associated with board
  # passed through request params.
  # Tasks are saved as DB::SprintTask in following JSON format:
  #
  #      {
  #        [
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
    return if board.active_sprint

    lists = board.lists.visible(true).includes(:tasks)
    lists.each do |list|
      list.tasks.each do |task|
        ::DB::SprintTask.new(
          task:,
          sprint: self,
          data: [{ state: list.name, date: ::Time.now }]
        ).save
      end
    end
    save
  end

  # @return [Boolean, nil]
  def end
    return unless end_date.nil?

    final_list.tasks.destroy_all
    self.end_date = ::Time.now
    save(validate: false)
  end

  # @return [Array]
  def burnup_chart_data
    [
      {
        name: 'Work Scope',
        data: points_in_sprint
      },
      {
        name: 'Completed work',
        data: {
          (Time.now - 1.week) => 0,
          (Time.now - 1.week + 1.hour) => 2,
          (Time.now - 1.week + 4.hour) => 3,
          (Time.now - 1.week + 14.hour) => 5,
          (Time.now - 1.week + 24.hour) => 10,
          (Time.now - 1.week + 30.hour) => 15,
          (Time.now - 1.week + 35.hour) => 20,
          (Time.now - 1.week + 48.hour) => 21,
          (Time.now - 3.days) => 22
        }
      }
    ]
  end

  # @return [Hash]
  def points_in_sprint
    result = {}
    sum = 0
    sprint_tasks.includes(:task).each do |st|
      start_date = st.data.first['date'].to_time.change(usec: 0).to_s
      result[start_date] = sum += st.task.points
    end
    result[due_date.to_s] = tasks.each.sum(&:points)
    result
  end

  def completed_work
    # final_list_name = final_list.name
    # result = {}
    # sprint_tasks.includes(:task).each do |st|
    #   end_date = st.data.last['date'].to_time.change(usec: 0).to_s
    #   result[start_date] = sum += st.task.points
    # end
    # result
  end
end
