json.extract! script_trigger, :id, :script_id, :subject_type, :subject_id, :action, :delay
json.url api_script_trigger_url(script_trigger, format: :json)
