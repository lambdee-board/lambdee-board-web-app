# frozen_string_literal: true

::FactoryBot.define do
  factory :ui_script_trigger, class: '::DB::UiScriptTrigger' do
    association :script
    association :author, factory: :user
    text { 'Send a message' }
    color { ::Faker::Color.hex_color }
  end
end
