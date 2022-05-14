# frozen_string_literal: true

::FactoryBot.define do
  factory :workspace, class: 'DB::Workspace' do
    name { "MyString" }
  end
end
