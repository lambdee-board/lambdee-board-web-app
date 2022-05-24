# frozen_string_literal: true

# Controller which provides a full CRUD for comments
# through the JSON API.
class API::CommentsController < ::APIController
  before_action :set_comment, only: %i[show update destroy]

  # GET /comments
  def index
    @comments = ::DB::Comment.all
  end

  # GET /comments/1
  def show; end

  # POST /comments
  def create
    @comment = ::DB::Comment.new(comment_params)
    return render :show, status: :created, location: api_comments_url(@comment) if @comment.save

    render json: @comment.errors, status: :unprocessable_entity
  end

  # PATCH/PUT /comments/1
  def update
    return render :show, status: :ok, location: api_comments_url(@comment) if @comment.update(comment_params)

    render json: @comment.errors, status: :unprocessable_entity
  end

  # DELETE /comments/1
  def destroy
    @comment.archive!
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_comment
    @comment = ::DB::Comment.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def comment_params
    params.require(:comment).permit(:body, :deleted, :author_id, :task_id)
  end
end
