# frozen_string_literal: true

require 'test_helper'

class ::DB::UiScriptTriggerTest < ::ActiveSupport::TestCase
  should 'be invalid when no scope and subject_id is nil' do
    trigger = ::FactoryBot.create(:ui_script_trigger)
    assert trigger.valid?

    trigger.subject_type = 'DB::Workspace'
    assert_not trigger.valid?
  end

  should 'find for record' do
    user = ::FactoryBot.create(:user)
    board = ::FactoryBot.create(:board)
    list = ::FactoryBot.create(:list, board: board)
    task = ::FactoryBot.create(:task, list: list)
    scope_trigger = ::FactoryBot.create(:ui_script_trigger, subject_type: 'DB::Task', scope: board)
    subject_trigger = ::FactoryBot.create(:ui_script_trigger, subject: task, private: true, author: user)

    ::FactoryBot.create(:ui_script_trigger)
    ::FactoryBot.create(:ui_script_trigger, private: true)
    ::FactoryBot.create(:ui_script_trigger, subject_type: 'DB::Task', scope: board, private: true)
    ::FactoryBot.create(:ui_script_trigger, subject: task, private: true)
    ::FactoryBot.create(:ui_script_trigger, subject_type: 'DB::Task', scope: ::FactoryBot.create(:board))
    ::FactoryBot.create(:ui_script_trigger, subject: ::FactoryBot.create(:task))

    triggers = ::DB::UiScriptTrigger.regarding_record_and_user(task, user)
    assert_equal 2, triggers.size
    assert triggers.include? scope_trigger
    assert triggers.include? subject_trigger
  end

  should 'find for record 2' do
    user = ::FactoryBot.create(:user, role: :admin)
    script = ::FactoryBot.create(:script)
    ::FactoryBot.create(:ui_script_trigger, author: user, text: 'global', script: script)
    wrk = ::FactoryBot.create(:workspace)
    board = ::FactoryBot.create(:board, workspace: wrk)
    list = ::FactoryBot.create(:list, board: board)
    task = ::FactoryBot.create(:task, list: list)

    ::FactoryBot.create(:ui_script_trigger, author: user, script: script, subject: wrk, text: 'Run on workspace')
    ::FactoryBot.create(:ui_script_trigger, author: user, script: script, subject: board, text: 'Run on board')
    ::FactoryBot.create(:ui_script_trigger, author: user, script: script, subject: board, text: 'Run on board - second')
    ::FactoryBot.create(:ui_script_trigger, author: user, script: script, subject_type: 'DB::Task', scope: board, text: 'Run on task')

    result = ::DB::UiScriptTrigger.regarding_record_and_user(wrk, user)
    assert_equal 1, result.size
    assert_equal 'Run on workspace', result[0]['text']

    result = ::DB::UiScriptTrigger.regarding_record_and_user(board, user)
    assert_equal 2, result.size
    assert_equal 'Run on board', result[0]['text']
    assert_equal 'Run on board - second', result[1]['text']

    result = ::DB::UiScriptTrigger.regarding_record_and_user(task, user)
    assert_equal 1, result.size
    assert_equal 'Run on task', result[0]['text']
  end
end
