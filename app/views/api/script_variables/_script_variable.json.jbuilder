json.extract! script_variable,
              :id,
              :name,
              :description,
              :owner_id,
              :owner_type,
              :created_at,
              :updated_at

json.value script_variable.value if local_assigns[:decrypt]
json.url api_script_variable_url(script_variable, format: :json)
