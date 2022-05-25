json.extract! tag, :id, :name, :colour
json.url api_tag_url(tag, format: :json)

return if local_assigns[:short]

json.extract! tag, :board_id, :created_at, :updated_at
