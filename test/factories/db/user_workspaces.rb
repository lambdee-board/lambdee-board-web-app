# frozen_string_literal: true

::FactoryBot.define do
  factory :user_workspace, class: 'DB::UserWorkspace' do
    association :user
    association :workspace
  end
end
