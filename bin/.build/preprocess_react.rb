# frozen_string_literal: true
# rails runner bin/.build/preprocess_react.rb

require 'fileutils'

using ::ScriptRefinement

def helpers
  ::ApplicationController.helpers
end

def asset_path(...)
  helpers.asset_path(...)
rescue ::Sprockets::Rails::Helper::AssetNotFound => e
  error e.message.strip
end

def asset_url(*args, **kwargs, &)
  helpers.asset_path(
    *args,
    {
      host: ::Rails.application.default_url_options[:host],
      protocol: ::Rails.application.default_url_options[:protocol],
      **kwargs
    },
    &
  )
rescue ::Sprockets::Rails::Helper::AssetNotFound => e
  error e.message.strip
end

title 'Preprocessing React files using ERB'

build_dir = ::Rails.root.join('frontend', 'build')
src_dir = ::Rails.root.join('frontend', 'src')
::FileUtils.rm_rf build_dir
::FileUtils.cp_r src_dir, build_dir

asset_build_dir = ::Rails.root.join('app', 'assets', 'builds')
asset_source_dir = ::File.join src_dir, 'assets/'
::FileUtils.rm_rf asset_build_dir unless ::Rails.env.production?
::FileUtils.cp_r asset_source_dir, asset_build_dir

::Dir[::File.join(build_dir, '**', '*.erb')].each do |file_name|
  preprocessed_content = ::ERB.new(::File.read(file_name)).result
  new_file_name = file_name.delete_suffix '.erb'
  ::File.delete(file_name) rescue nil
  ::File.write(new_file_name, preprocessed_content)
end

puts "\nš Preprocessing React finished\n\n"
