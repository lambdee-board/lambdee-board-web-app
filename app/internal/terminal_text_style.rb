# frozen_string_literal: true

# Defines methods for decorating strings
# with styles (like colours, underlines etc) visible in the terminal.
module TerminalTextStyle
  extend self

  # @return [Hash{Symbol => String}]
  MAP = {
    blue: "\033[94m",
    cyan: "\033[96m",
    green: "\033[92m",
    yellow: "\033[93m",
    red: "\033[91m",
    terminate: "\033[0m",
    bold: "\033[1m",
    italic: "\033[3m",
    underline: "\033[4m"
  }.freeze

  # Style a string with an *ASCII* escape code
  #
  # @param string [String]
  # @param style [Symbol]
  # @return [String]
  def with_style(string, style) = "#{MAP[style]}#{string}#{MAP[:terminate]}"

  # Style a string with multiple *ASCII* escape codes
  #
  # @param string [String]
  # @param styles [Array<Symbol>]
  # @return [String]
  def with_styles(string, *styles)
    result = ::String.new
    styles.each do |style|
      result << MAP[style]
    end

    result << "#{string}#{MAP[:terminate]}"
  end
end
