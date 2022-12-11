# frozen_string_literal: true

::FactoryBot.define do
  factory :script_run, class: '::DB::ScriptRun' do
    input { "puts 'Hello world'" }
    output { 'Hello world' }
    state { 'running' }
    triggered_at { ::Time.now }
    delay { 60 }
    executed_at { ::Time.now + 1.minute }
    association :script
    association :initiator, factory: :user
  end
end
