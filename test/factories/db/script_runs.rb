# frozen_string_literal: true

::FactoryBot.define do
  factory :script_run, class: '::DB::ScriptRun' do
    input { "puts 'Hello world'" }
    output { 'Hello world' }
    association :script
    association :initiator, factory: :user
  end
end
