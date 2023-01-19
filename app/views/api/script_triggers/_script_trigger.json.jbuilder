json.extract! script_trigger, :id, :script_id, :subject_type, :subject_id, :scope_type, :scope_id, :action, :delay, :private, :author_id
json.url api_script_trigger_url(script_trigger, format: :json)
