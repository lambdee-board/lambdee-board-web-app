json.extract! script_run, :id, :script_id, :input, :output, :initiator_id, :state
json.url api_script_run_url(script_run, format: :json)
