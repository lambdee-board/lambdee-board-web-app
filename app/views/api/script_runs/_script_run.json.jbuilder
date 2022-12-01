json.extract! script_run, :id, :script_id, :input, :output, :initiator_id, :state, :delay
json.script_name script_run.script.name
json.url api_script_run_url(script_run, format: :json)
