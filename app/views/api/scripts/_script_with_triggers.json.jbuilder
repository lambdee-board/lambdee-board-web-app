json.partial! 'script', script: script
json.script_triggers do
  json.array! script.script_triggers do |st|
    json.partial! 'api/script_triggers/script_trigger', script_trigger: st
  end
  json.array! script.ui_script_triggers do |ust|
    json.partial! 'api/ui_script_triggers/ui_script_trigger', ui_script_trigger: ust
  end
end
