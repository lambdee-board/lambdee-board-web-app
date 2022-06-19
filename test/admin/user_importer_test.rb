# frozen_string_literal: true

require 'test_helper'

class UserImporterTest < ActiveSupport::TestCase
  should 'import users from csv file' do
    uploaded_file = ::ActionDispatch::Http::UploadedFile.new({
      tempfile: ::File.new(::Rails.root.join('test/support/users.csv'))
    })
    importer = ::UserImporter.new(uploaded_file, '0')
    assert_difference('::DB::User.count', 2) do
      importer.run
    end

    user1 = ::DB::User.first
    assert_equal 'michal', user1.name
    assert_equal 'example@example.com', user1.email
    assert_equal 'developer', user1.role

    user2 = ::DB::User.second
    assert_equal 'jacob', user2.name
    assert_equal 'guest@xd.pl', user2.email
    assert_equal 'guest', user2.role

    assert importer.full_message.include?('2 users from 4 rows have been imported!')
    assert importer.full_message.include?('Validation failed: Email has already been taken')
    assert importer.full_message.include?("'admins' is not a valid role")
    assert_not importer.file_error?
    assert_nil importer.file_error_message
  end

  should 'fail if file is not a csv file' do
    uploaded_file = ::ActionDispatch::Http::UploadedFile.new({
      tempfile: ::File.new(::Rails.root.join('test/support/wrong_file.jpg'))
    })
    importer = ::UserImporter.new(uploaded_file, '0')
    assert_no_difference('::DB::User.count') do
      importer.run
    end
    assert_equal '0 users from 0 rows have been imported!', importer.full_message
    assert importer.file_error?
    assert importer.file_error_message.include?("An error occurred. Couldn't import users")
  end
end
