json.extract! comment, :id, :body, :deleted, :author_id, :task_id, :created_at, :updated_at
json.url api_comment_url(comment, format: :json)
