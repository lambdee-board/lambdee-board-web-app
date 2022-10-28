# frozen_string_literal: true

class QueryAPI::Search
  # Primitive type which maps a table
  # name to an `ActiveRecord` model.
  class Type < ::Shale::Type::Value
    PERMITTED_MODELS = {
      boards:          ::DB::Board,
      comments:        ::DB::Comment,
      lists:           ::DB::List,
      tags:            ::DB::Tag,
      task_tags:       ::DB::TaskTag,
      task_users:      ::DB::TaskUser,
      tasks:           ::DB::Task,
      user_workspaces: ::DB::UserWorkspace,
      users:           ::DB::User,
      workspaces:      ::DB::Workspace
    }.freeze

    class << self
      # Decode from JSON/Hash.
      #
      # @param [String, Object, nil]
      # @return [Object, nil]
      def cast(value)
        return if value.nil?
        return value if value.is_a?(::Class)
        return PERMITTED_MODELS[value.to_sym] if value.respond_to? :to_sym
      end
    end
  end
end
