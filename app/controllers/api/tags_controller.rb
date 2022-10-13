# frozen_string_literal: true

# Controller which provides a service for tags
# through the JSON API.
class API::TagsController < ::APIController
  before_action :set_tag, only: %i[show update destroy]
  authorize_resource only: %i[show update destroy]

  # GET api/boards/:board_id/tags or GET api/tasks/:task_id/tags
  def index
    @tags = if params[:task_id]
              ::DB::Task.find(params[:task_id]).tags
            elsif params[:board_id]
              ::DB::Tag.for_board(params[:board_id])
            else
              ::DB::Tag.all
            end
    @tags = @tags.accessible_by(current_ability)
  end

  # GET api/tags/1
  def show; end

  # POST api/boards/:board_id/tags or api/tasks/:task_id/tags or api/tags
  def create
    @tag = ::DB::Tag.new(tag_params)
    @tag.board_id = params[:board_id] if params[:board_id]
    relate_tag_with_task if params[:task_id]

    return render :show, status: :created, location: api_tag_url(@tag) if @tag.save

    render json: @tag.errors, status: :unprocessable_entity
  end

  # PATCH/PUT api/tags/1
  def update
    return render :show, status: :ok, location: api_tags_url(@tag) if @tag.update(tag_params)

    render json: @tag.errors, status: :unprocessable_entity
  end

  # DELETE api/tags/1
  def destroy
    @tag.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_tag
    @tag = ::DB::Tag.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def tag_params
    params.require(:tag).permit(:name, :colour, :board_id)
  end

  def relate_tag_with_task
    task = ::DB::Task.find(params[:task_id])
    @tag.tasks << task
    @tag.board_id = task.list.board_id
  end
end
