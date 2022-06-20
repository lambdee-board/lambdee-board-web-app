# frozen_string_literal: true

module ApplicationHelper
  # @param path [Array<String>]
  # @return [Boolean]
  def asset_exists?(*path)
    ::File.exist? ::Rails.root.join('app', 'assets', *path)
  end

  alias asset_exist? asset_exists?

  # @param path [Array<String>]
  # @return [Boolean]
  def file_exists?(*path)
    ::File.exist? ::Rails.root.join(*path)
  end

  alias file_exist? file_exists?

  # @return [Boolean]
  def react_build_error?
    ::Rails.env.development? && react_not_built? && file_exist?(::Config::REACT_BUILD_ERROR_FILE_PATH)
  end

  # @return [Boolean]
  def react_not_built?
    return false if ::Rails.env.production?

    !asset_exists?('builds', 'frontend.js')
  end
end
