# frozen_string_literal: true

module Config
  # @return [Pathname]
  REACT_BUILD_ERROR_FILE_PATH = ::Rails.root.join('tmp', 'react_build_error.json')
end
