json.extract! ui_script_trigger, :id, :script_id, :subject_type, :subject_id, :scope_type, :scope_id, :author_id, :delay, :private, :colour, :text
json.url api_ui_script_trigger_url(ui_script_trigger, format: :json)
