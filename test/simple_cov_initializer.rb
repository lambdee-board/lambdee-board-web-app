# frozen_string_literal: true

# Sets up SimpleCov for tests
# if the `COVERAGE` env variable is set.
module SimpleCovInitializer
  # Load SimpleCov for code coverage if
  # the `COVERAGE` environment variable is set
  #
  # SimpleCov has to be the first thing that is loaded
  #
  # @param suite_name [String]
  # @return [void]
  def self.call(suite_name)
    return unless ::ENV['COVERAGE']

    require 'simplecov'
    require 'simplecov-cobertura'

    ::SimpleCov.command_name suite_name
    ::SimpleCov.formatter = ::SimpleCov::Formatter::MultiFormatter.new([
      ::SimpleCov::Formatter::HTMLFormatter,
      ::SimpleCov::Formatter::CoberturaFormatter
    ])

    ::SimpleCov.start 'rails' do
      add_filter '/test/'
      add_filter '/app/admin/'
      add_filter '/app/helpers/'
      add_filter '/app/jobs/'
      add_filter '/frontend/'
      add_filter '/lib/'
      add_filter '/vendor/'
    end
  end
end
