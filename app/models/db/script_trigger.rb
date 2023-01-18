# frozen_string_literal: true

# Allows to run a connected script after the defined action.
class ::DB::ScriptTrigger < ::ApplicationRecord
  ACTIONS = ::Set['create', 'update', 'destroy']

  belongs_to :subject, polymorphic: true, optional: true
  belongs_to :scope, polymorphic: true, optional: true
  belongs_to :script
  belongs_to :author, class_name: 'DB::User'

  scope :with_action, ->(action) { where(action: action) }
  scope :with_author, ->(author) { where(author: author) }
  scope :not_private, -> { where(private: false) }
  scope :for_record, ->(record) { where(subject: record) }
  scope :for_model, ->(model, scope) { where(subject_type: model.to_s).where(subject_id: nil).where(scope: scope) }

  default_scope { order(id: :desc) }

  attribute :private, default: false

  validates :scope, presence: true, if: -> { subject_id.nil? }
  validates :scope_id, presence: true, if: -> { scope_type }
  validates :action, presence: true, inclusion: { in: ACTIONS }

  class << self
    # @param record [ApplicationRecord]
    # @param user [DB::User]
    def regarding_record_and_user(record, user)
      query = for_record(record)
      record.class::AVAILABLE_SCOPES.each do |scope_name|
        query = query.or(for_model(record.class, record.public_send(scope_name)))
      end
      query = query.merge(not_private.or(with_author(user)))
    end

    # @param record [ApplicationRecord]
    # @param user [DB::User]
    # @param action [String, Symbol]
    def regarding_record_and_user_for_action(record, user, action)
      regarding_record_and_user(record, user).merge(with_action(action))
    end
  end
end
