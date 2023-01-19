# frozen_string_literal: true

# Allows to run a connected script after the defined action.
class ::DB::ScriptTrigger < ::ApplicationRecord
  include ::ScriptTriggerSearchable

  ACTIONS = ::Set['create', 'update', 'destroy']

  belongs_to :subject, polymorphic: true, optional: true
  belongs_to :scope, polymorphic: true, optional: true
  belongs_to :script
  belongs_to :author, class_name: 'DB::User'

  scope :with_action, ->(action) { where(action: action) }

  default_scope { order(id: :desc) }

  attribute :private, default: false

  validates :scope, presence: true, if: -> { subject_id.nil? }
  validates :scope_id, presence: true, if: -> { scope_type }
  validates :action, presence: true, inclusion: { in: ACTIONS }

  class << self
    # @param record [ApplicationRecord]
    # @param user [DB::User]
    # @param action [String, Symbol]
    def regarding_record_and_user_for_action(record, user, action)
      regarding_record_and_user(record, user).merge(with_action(action))
    end
  end
end
