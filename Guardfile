# A sample Guardfile
# More info at https://github.com/guard/guard#readme

## Uncomment and set this to only include directories you want to watch
# directories %w(app lib config test spec features) \
#  .select{|d| Dir.exist?(d) ? d : UI.warning("Directory #{d} does not exist")}

## Note: if you are using the `directories` clause above and you are not
## watching the project directory ('.'), then you will want to move
## the Guardfile to a watched dir and symlink it back, e.g.
#
#  $ mkdir config
#  $ mv Guardfile config/
#  $ ln -s config/Guardfile .
#
# and, you'll have to watch "config/Guardfile" instead of "Guardfile"

guard 'livereload', grace_period: 1 do
  asset_extensions = %i[css js erb png gif svg jpg jpeg].join '|'

  # file types LiveReload may optimize refresh for
  watch(%r{public/.+\.(#{asset_extensions})})

  # Rails Assets Pipeline
  # watch(%r{(app|vendor)(/assets/builds/(.+\.(#{asset_extensions}))).*}) { |m| "/assets/builds/#{m[3]}" }

  # Frontend
  watch(%r{frontend(/build/(.+\.(#{asset_extensions}))).*})

  # file needing a full reload of the page anyway
  watch(%r{app/views/.+\.erb$})
end
