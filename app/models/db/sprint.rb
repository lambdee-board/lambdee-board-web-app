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
        name: 'Guideline',
        data: {
          start_date => 0,
          due_date => sum_story_points
        }
      },
      {
        name: 'Completed work',
        data: {
          (start_date) => 0,
          (start_date + 1.hour) => 2,
          (start_date + 4.hour) => 3,
          (start_date + 14.hour) => 5,
          (start_date + 24.hour) => 10,
          (start_date + 30.hour) => 15,
          (start_date + 35.hour) => 20,
          (start_date + 48.hour) => 21,
          (due_date) => 22
        }
      }
    ]
  end

  # @return [Integer]
  def sum_story_points
    tasks.each.sum(&:points)
  end

  def xd
    sprint_tasks.each do |st|
      result = {}
      st.data.each do |data|
        result[data['state']] = result[data['state']].to_i + data.task.points if 1
      end
    end
  end
end
