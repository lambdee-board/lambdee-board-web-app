# frozen_string_literal: true

# Adds time to a task.
class AddTaskTimeService
  include ::ActiveModel::Validations

  # @return [Set<Symbol>]
  TIME_UNITS = ::Set[:day, :hour, :minute, :second].freeze

  validates :time, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :unit, presence: true, inclusion: { in: TIME_UNITS }

  attr_reader :time, :unit

  # @param task [DB::Task]
  # @param time [Integer, String]
  # @param unit [Symbol, String]
  def initialize(task, time, unit)
    @task = task
    @time = time.to_i
    @unit = (unit || :second).to_sym
  end

  # @return [Boolean] Whether the update was successful
  def save
    @task.spent_time += seconds
    @task.save
  end

  # @return [Integer]
  def seconds
    @seconds ||=
      case @unit
      when :day     then @time * 3600 * 24
      when :hour    then @time * 3600
      when :minute  then @time * 60
      when :second  then @time
      end
  end
end
