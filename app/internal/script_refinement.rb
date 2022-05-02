# frozen_string_literal: true

require_relative 'terminal_text_style'

# Endows some built-in Ruby objects with
# convenience methods useful for scripting.
#
# Pass it to the `using` method to apply these methods.
#
#     using ScriptRefinement
#
#     title "Hey!" #=> == Hey! ==
#     error "Failed" #=> !! Failed !!
#     "Hey!".with_styles(:bold, :red) #=> "\e[1m\e[91mHey!\e[0m"
#
module ScriptRefinement
  extend self

  # @param val [String]
  # @return [void]
  def system!(val) = system(val) || abort(error_string("Command `#{val}` failed"))

  # @param string [String]
  # @return [void]
  def title(string) = puts "\n", title_string(string)

  # @param string [String]
  # @return [void]
  def error(string) = puts "\n", error_string(string)

  # @param string [String]
  # @return [String]
  def title_string(string) = ::TerminalTextStyle.with_styles "== #{string} ==", :green, :underline, :italic

  # @param string [String]
  # @return [String]
  def error_string(string) = ::TerminalTextStyle.with_styles "!! #{string} !!", :bold, :red

  refine ::String do
    # Style a string with multiple *ASCII* escape codes
    #
    # @param styles [Array<Symbol>]
    # @return [String]
    def with_styles(*styles) = ::TerminalTextStyle.with_styles self, *styles
  end

  refine ::Kernel do
    import_methods ::ScriptRefinement

    alias_method :`, :system!
  end
end
