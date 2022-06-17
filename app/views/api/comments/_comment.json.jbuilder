json.extract! comment, :id, :body, :deleted_at, :author_id, :task_id, :created_at, :updated_at
json.url api_comment_url(comment, format: :json)

return unless @with_author

json.author do
  json.partial! 'api/users/user', user: comment.author
end
