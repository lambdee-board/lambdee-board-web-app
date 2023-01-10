# frozen_string_literal: true

# Represents a single trigger which
# causes a particular script to run
# when some predefined event happens.
class ::DB::UiScriptTrigger < ::ApplicationRecord
  belongs_to :scope, polymorphic: true, optional: true
  belongs_to :subject, polymorphic: true, optional: true
  belongs_to :script
end
