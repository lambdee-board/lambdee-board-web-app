Rswag::Api.configure do |c|

  # Specify a root folder where Swagger JSON files are located
  # This is used by the Swagger middleware to serve requests for API descriptions
  # swagger/v1/swagger.yaml is maintained manually (rswag-specs has been removed).
  c.swagger_root = Rails.root.to_s + '/swagger'

  # Inject a lamda function to alter the returned Swagger prior to serialization
  # The function will have access to the rack env for the current request
  # For example, you could leverage this to dynamically assign the "host" property
  #
  #c.swagger_filter = lambda { |swagger, env| swagger['host'] = env['HTTP_HOST'] }
end
