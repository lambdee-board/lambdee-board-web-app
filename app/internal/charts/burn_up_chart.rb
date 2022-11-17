# frozen_string_literal: true

module ::Charts
  # Contains methods for generating burn up chart.
  module BurnUpChart
    # @return [Array<Hash>]
    def burn_up_chart_data
      [
        {
          name: 'Work Scope',
          data: points_in_sprint_in_time
        },
        {
          name: 'Completed Work',
          data: completed_work
        }
      ]
    end

    private

    # @return [Hash]
    def points_in_sprint_in_time
      result = dates_hash.dup
      sum = 0
      result[start_date.to_s] = 0
      sprint_tasks.order(:added_at).includes(:task).each do |st|
        start_date = st.addition_date.to_s
        sum += st.task.points if st.task.points
        result[start_date] = sum
      end

      result.fill_nil_values!
    end

    # @return [Hash]
    def completed_work
      result = dates_hash.dup
      sum = 0
      result[start_date.to_s] = 0
      sprint_tasks.order(:completed_at).includes(:task).each do |st|
        next unless st.completed_at

        end_date = st.completion_date.to_s
        sum += st.task.points if st.task.points
        result[end_date] = sum
      end

      result.fill_nil_values!
      result[expected_end_date.to_s] = nil if expected_end_date.future?
      result
    end

    # @return [Hash]
    def dates_hash
      return @result if @result

      dates = ::Set.new
      dates.add start_date.to_s
      sprint_tasks.each do |st|
        dates.add st.addition_date.to_s
        next unless st.completed_at

        dates.add st.completion_date.to_s
      end
      dates.add expected_end_date.to_s
      dates.add end_date.to_s if end_date
      @result = FilledHash.new
      dates.sort.each { @result[_1] = nil }
      @result
    end
  end
end
