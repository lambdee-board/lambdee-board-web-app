# frozen_string_literal: true

# Allows to run a connected script after the defined action.
class ::DB::ScriptTrigger < ::ApplicationRecord
  ACTIONS = ::Set['create', 'update', 'destroy']

  belongs_to :subject, polymorphic: true, optional: true
  belongs_to :script

  scope :global, -> { where(subject_type: nil) }
  scope :for_model, ->(model) { where(subject_type: model.to_s).where(subject: nil) }
  scope :for_record, ->(record) { where(subject: record) }

  scope :regarding_record, (lambda do |record|
    global.or(for_model(record.class)).or(for_record(record))
  end)

  scope :with_action, ->(action) { where(action: action) }

  validates :action, presence: true, inclusion: { in: ACTIONS }
end
