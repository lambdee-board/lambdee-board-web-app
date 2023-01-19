# frozen_string_literal: true

# Represents a many to many relationship
# between `DB::User` and `DB::Workspace`
class DB::UserWorkspace < ApplicationRecord
  belongs_to :user
  belongs_to :workspace
end
