# frozen_string_literal: true

# Wraps data gathered from various Rails configuration files
# inside the `config` folder.
#
# Implements helper methods for loading and manipulating configuration files.
#
module Config
  extend self

  ROOT = ::Pathname.new ::File.expand_path('..', __dir__)

  # Load a *YAML* file from the `config` folder inside this Rails project.
  # It also preprocesses it using *ERB* prior to loading.
  # Returns parsed Ruby objects (`Hash` or `Array` on top level).
  #
  #     Config.load_yaml('example.yml') # will load `config/example.yml`
  #
  # @param file_name [Array<String>]
  # @return [Hash, Array]
  def load_yaml(*file_name)
    ::YAML.load(load_erb(*file_name), aliases: true)[::Rails.env.to_s]
  end

  # Load a text file from the `config` folder inside this Rails project.
  # It preprocesses it using *ERB* and returns a `String`, that is the whole content of the file.
  #
  #     Config.load_erb('example.html') # will load `config/example.html`
  #
  # @param file_name [Array<String>]
  # @return [String]
  def load_erb(*file_name)
    ::ERB.new(load_file(*file_name)).result
  end

  # Load a text file from the `config` folder inside this Rails project.
  # Returns a `String`, that is the whole content of the file.
  #
  #     Config.load_file('example.txt') # will load `config/example.txt`
  #
  # @param file_name [Array<String>]
  # @return [String]
  def load_file(*file_name)
    ::File.read(::File.join(ROOT.to_s, "config", *file_name))
  end
end
