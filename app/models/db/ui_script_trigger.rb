# frozen_string_literal: true

# Represents a single trigger which
# causes a particular script to run
# when some predefined event happens.
class ::DB::UiScriptTrigger < ::ApplicationRecord
  ALLOWED_SUBJECT_CLASSES = ::Set['DB::Workspace', 'DB::Board', 'DB::Task']

  belongs_to :subject, polymorphic: true, optional: true
  # Scope occurs only when subject_id is nil
  belongs_to :scope, polymorphic: true, optional: true
  belongs_to :script
  belongs_to :author, class_name: 'DB::User'

  scope :with_author, ->(author) { where(author: author) }
  scope :not_private, -> { where(private: [nil, false]) }
  scope :for_record, ->(record) { where(subject: record) }
  scope :for_model, ->(model, scope) { where(subject_type: model.to_s).where(subject_id: nil).where(scope: scope) }
  scope :global, ->(author) { with_author(author).where(subject_type: nil) }

  validates :scope, presence: true, if: -> { subject_type && subject_id.nil? }
  validates :scope_id, presence: true, if: -> { scope_type }
  validates :subject_type, inclusion: { in: ALLOWED_SUBJECT_CLASSES }, allow_nil: true
  validates :colour, length: { minimum: 7, maximum: 9 }, allow_blank: true
  validates :text, length: { maximum: 100 }

  class << self
    # @param record [ApplicationRecord]
    # @param user [DB::User]
    def regarding_record_and_user(record, user)
      query = for_record(record)
      record.class::AVAILABLE_SCOPES.each do |scope_name|
        query = query.or(for_model(record.class, record.public_send(scope_name)))
      end
      query = query.not_private.or(with_author(user))
    end
  end

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
end
