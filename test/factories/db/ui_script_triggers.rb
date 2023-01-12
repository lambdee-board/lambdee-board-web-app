# frozen_string_literal: true

::FactoryBot.define do
  factory :ui_script_trigger, class: '::DB::UiScriptTrigger' do
    association :script
    association :author, factory: :user
    text { 'Send a message' }
    colour { '#ffffff' }
  end
end
