# frozen_string_literal: true

class ::DB::UiScriptTrigger < ::ApplicationRecord
  belongs_to :subject, polymorphic: true, optional: true
  belongs_to :scope, polymorphic: true, optional: true
  belongs_to :script
end
