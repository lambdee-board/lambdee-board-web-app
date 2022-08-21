# frozen_string_literal: true

# A class for importing users from CSV file
class UserImporter
  attr_reader :file_error_message

  def initialize(csv, deactivated)
    @csv = csv
    @failed_rows = []
    @users_count = 0
    @deactivated = deactivated == '1'
  end

  def run
    @file_error_message = 'An error occurred. File has not been uploaded.' and return unless @csv

    ::CSV.foreach(@csv, headers: true, header_converters: ->(v) { v.strip }) do |row|
      row = row.to_hash
      row['password'] = 'temporary_password'
      row['role'] = 'guest' if row['role'].blank?
      user = ::DB::User.create!(row)
      user.destroy if @deactivated
      @users_count += 1
    rescue ::ActiveRecord::RecordInvalid, ::ArgumentError => e
      @failed_rows << "Name: #{row['name']}, Email: #{row['email']}, Error: #{e.message}"
    end
  rescue => e
    @file_error_message = "An error occurred. Couldn't import users. Error: #{e}"
  end

  # @return [String]
  def full_message
    "#{@users_count} users from #{@users_count + @failed_rows.size} rows have been imported!#{" An import error occurred for these rows: #{@failed_rows}" if @failed_rows.any?}"
  end

  # @return [Boolean]
  def file_error?
    !!file_error_message
  end
end
