# frozen_string_literal: true

# Wraps the universal data for all scripts,
# mainly its body (eg. Ruby code)
class ::DB::Script < ::ApplicationRecord
  has_many :script_runs, dependent: :destroy
  has_many :script_triggers, dependent: :destroy
  has_many :ui_script_triggers, dependent: :destroy
  belongs_to :author, class_name: '::DB::User'

  validates :name, presence: true

  default_scope { order(:id) }

  attribute :content, default: ''

  accepts_nested_attributes_for :script_triggers, :ui_script_triggers, allow_destroy: true

  # @param subject [ApplicationRecord, nil]
  # @param delay [Integer, nil]
  def execute(subject, delay: nil)
    @subject = subject
    @initiator = ::Current.user || author
    script_run = ::DB::ScriptRun.create(
      script: self,
      state: :waiting,
      triggered_at: ::Time.now,
      delay: delay,
      initiator: @initiator,
      input: extended_content
    )

    ::ExecuteScriptJob.set(wait: delay&.seconds).perform_later(script_run.id)
  end

  private

  def extended_content
    return content unless @subject

    <<~SCRIPT
      context[:initiator] = DB::User.from_record(#{@initiator.as_json})
      context[:subject] = #{@subject.class}.from_record(#{@subject.as_json})
      context[:subject_before_update] = #{@subject.class}.from_record(#{@subject.previous_object_state.as_json || @subject.as_json})
      context.keys.each { |k| define_method(k) { context[k] } }

      #{content}
    SCRIPT
  end
end
