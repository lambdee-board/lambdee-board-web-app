# frozen_string_literal: true

class ::DB::CallbackScript < ::ApplicationRecord
  belongs_to :subject, polymorphic: true, optional: true
  belongs_to :script

  scope :global, -> { where(subject_type: nil) }
  scope :for_model, ->(model) { where(subject_type: model.to_s).where(subject: nil) }
  scope :for_record, ->(record) { where(subject: record) }

  scope :regarding_record, (lambda do |record|
    global.or(for_model(record.class)).or(for_record(record))
  end)

  scope :with_action, ->(action) { where(action: action) }
  scope :with_action_create, -> { with_action(:create) }

  validates :action, presence: true
end
