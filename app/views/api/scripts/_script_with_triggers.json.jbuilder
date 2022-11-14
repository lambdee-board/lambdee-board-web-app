json.partial! 'script', script: script
json.script_triggers do
  json.array! script.script_triggers do |st|
    json.partial! 'api/script_triggers/script_trigger', script_trigger: st
  end
end
