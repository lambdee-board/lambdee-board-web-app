# frozen_string_literal: true

# Controller which provides a full CRUD for comments
# through the JSON API.
class API::CommentsController < ::APIController
  before_action :set_comment, only: %i[show update destroy]
  authorize_resource except: %i[index create]

  # GET api/tasks/:task_id/comments
  def index
    if params[:with_author] == 'true'
      @comments = ::DB::Comment.find_with_author_for_task(params[:task_id])
      @with_author = true
    else
      @comments = ::DB::Comment.find_for_task(params[:task_id])
    end
    @comments = @comments.accessible_by(current_ability)
  end

  # GET /comments/1
  def show; end

  # POST /comments
  def create
    @comment = ::DB::Comment.new(comment_params)
    authorize! :create, @comment
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
    @comment.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_comment
    @comment = ::DB::Comment.with_deleted.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def comment_params
    params.require(:comment).permit(:body, :deleted, :author_id, :task_id)
  end
end
