# frozen_string_literal: true

# Allows searching for ScriptTriggers and IiScriptTriggers.
module ::ScriptTriggerSearchable
  extend ::ActiveSupport::Concern

  included do
    scope :with_author, ->(author) { where(author: author) }
    scope :not_private, -> { where(private: false) }
    scope :for_record, ->(record) { where(subject: record) }
    scope :for_model, ->(model, scope) { where(subject_type: model.to_s).where(subject_id: nil).where(scope: scope) }

    extend ClassMethods
  end

  # Class methods
  module ClassMethods
    # @param record [ApplicationRecord]
    # @param user [DB::User]
    def regarding_record_and_user(record, user)
      query = for_record(record)
      record.class::AVAILABLE_SCOPES.each do |scope_name|
        query = query.or(for_model(record.class, record.public_send(scope_name)))
      end
      query = query.merge(not_private.or(with_author(user)))
    end
  end
end
