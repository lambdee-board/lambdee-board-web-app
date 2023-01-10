# frozen_string_literal: true

# Abstract class which serves as
# a parent to all models (classes which represent database tables)
class ApplicationRecord < ::ActiveRecord::Base
  primary_abstract_class
end
