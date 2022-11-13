json.partial! 'script', script: script
json.callback_scripts do
  json.array! script.callback_scripts do |cs|
    json.partial! 'api/callback_scripts/callback_script', callback_script: cs
  end
end
