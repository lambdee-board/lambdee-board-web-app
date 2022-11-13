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
    ::ScriptServiceAPI.send_execute_script_request(extended_content)
  end

  private

  def extended_content
    script_header = "context = ::ActiveSupport::HashWithIndifferentAccess.new\n"
    script_header += "context[:subject] = #{@subject.class}.new(#{@subject.as_json})\n"
    script_header += "context[:subject_before_update] = #{@subject.class}.new(#{@subject.previous_object_state.as_json})\n"
    script_header += 'context.keys.each { |k| define_method(:"#{k}") { context["#{k}"] } }' # rubocop:disable Lint/InterpolationCheck
    script_header += "\n"
    script_header + content
  end
end
