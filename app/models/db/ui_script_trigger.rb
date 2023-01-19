# frozen_string_literal: true

# Represents a single trigger which
# causes a particular script to run
# when some predefined event happens.
class ::DB::UiScriptTrigger < ::ApplicationRecord
  include ::ScriptTriggerSearchable

  ALLOWED_SUBJECT_CLASSES = ::Set['DB::Workspace', 'DB::Board', 'DB::Task']

  belongs_to :subject, polymorphic: true, optional: true
  # Scope occurs only when subject_id is nil
  belongs_to :scope, polymorphic: true, optional: true
  belongs_to :script
  belongs_to :author, class_name: 'DB::User'

  before_save :set_private_for_global

  scope :global, ->(author) { with_author(author).where(subject_type: nil) }

  default_scope { order(id: :desc) }

  attribute :private, default: false

  validates :scope, presence: true, if: -> { subject_type && subject_id.nil? }
  validates :scope_id, presence: true, if: -> { scope_type }
  validates :subject_type, inclusion: { in: ALLOWED_SUBJECT_CLASSES }, allow_nil: true
  validates :colour, length: { minimum: 7, maximum: 9 }, allow_blank: true
  validates :text, length: { maximum: 100 }

  # @param subject_id [String, Integer]
  # @return [ApplicationRecord, nil]
  def script_execution_subject(subject_id)
    return unless subject_type

    subject_type.constantize.find(subject_id)
  end

  # @param subject [ApplicationRecord, nil]
  # @return [void]
  def execute_script(subject)
    script.execute(subject, delay:)
  end

  private

  def set_private_for_global
    self.private = true unless subject_type
  end
end
