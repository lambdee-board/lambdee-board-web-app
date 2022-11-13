json.extract! script, :id, :content, :name, :description, :author_id
json.url api_script_url(script, format: :json)
json.callback_scripts do
  json.array! script.callback_scripts do |cs|
    json.partial! 'api/callback_scripts/callback_script', callback_script: cs
  end
end
