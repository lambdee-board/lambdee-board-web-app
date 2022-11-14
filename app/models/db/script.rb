# frozen_string_literal: true

class ::DB::Script < ::ApplicationRecord
  has_many :script_runs, dependent: :destroy
  has_many :callback_scripts, dependent: :destroy
  has_many :ui_scripts, dependent: :destroy
  belongs_to :author, class_name: '::DB::User'

  validates :name, presence: true

  accepts_nested_attributes_for :callback_scripts, :ui_scripts, allow_destroy: true

  # @param subject [ApplicationRecord]
  def execute(subject)
    @subject = subject
    script_run = ::DB::ScriptRun.create(script: self, initiator: author, input: extended_content)
    ::ScriptServiceAPI.send_execute_script_request(script_run)
  end

  private

  def extended_content
    script_header = <<~HEADER
      context = ::ActiveSupport::HashWithIndifferentAccess.new
      context[:subject] = #{@subject.class}.new(#{@subject.as_json})
      context[:subject_before_update] = #{@subject.class}.new(#{@subject.previous_object_state.as_json})
      context.keys.each { |k| define_method(k) { context[k] } }
    HEADER

    script_header + content
  end
end
