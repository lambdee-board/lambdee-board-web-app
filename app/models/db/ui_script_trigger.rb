# frozen_string_literal: true

class ::DB::UiScriptTrigger < ::ApplicationRecord
  belongs_to :scope, polymorphic: true
  belongs_to :subject, polymorphic: true
  belongs_to :script
end
