# frozen_string_literal: true

class ::DB::Script < ::ApplicationRecord
  has_many :script_runs, dependent: :destroy
  has_many :script_triggers, dependent: :destroy
  has_many :ui_script_triggers, dependent: :destroy
  belongs_to :author, class_name: '::DB::User'

  validates :name, presence: true

  default_scope { order(:id) }

  attribute :content, default: ''

  accepts_nested_attributes_for :script_triggers, :ui_script_triggers, allow_destroy: true

  # @param subject [ApplicationRecord]
  # @param delay [Integer, nil]
  def execute(subject, delay: nil)
    @subject = subject
    script_run = ::DB::ScriptRun.create(
      script: self,
      state: :waiting,
      triggered_at: ::Time.now,
      delay: delay,
      initiator: ::Current.user || author,
      input: extended_content
    )

    ::ExecuteScriptJob.set(wait: delay&.seconds).perform_later(script_run.id)
  end

  private

  def extended_content
    <<~SCRIPT
      context[:subject] = #{@subject.class}.from_record(#{@subject.as_json})
      context[:subject_before_update] = #{@subject.class}.from_record(#{@subject.previous_object_state.as_json})
      context.keys.each { |k| define_method(k) { context[k] } }

      #{content}
    SCRIPT
  end
end
