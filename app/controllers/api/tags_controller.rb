# frozen_string_literal: true

# Controller which provides a service for tags
# through the JSON API.
class API::TagsController < ::APIController
  before_action :set_tag, only: %i[show update destroy]

  # GET api/tasks/:task_id/tags
  def index
    set_task
    # @tags = @task.tags
    @tags = DB::Tag.all
  end

  # GET /tags/1
  # GET /tags/1.json
  def show
  end

  # POST /tags
  # POST /tags.json
  def create
    @tag = Tag.new(tag_params)

    if @tag.save
      render :show, status: :created, location: @tag
    else
      render json: @tag.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /tags/1
  # PATCH/PUT /tags/1.json
  def update
    if @tag.update(tag_params)
      render :show, status: :ok, location: @tag
    else
      render json: @tag.errors, status: :unprocessable_entity
    end
  end

  # DELETE /tags/1
  # DELETE /tags/1.json
  def destroy
    @tag.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_tag
    @tag = Tag.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def tag_params
    params.require(:tag).permit(:name, :colour, :board_id)
  end

  def set_task
    @task = ::DB::Task.find(params[:task_id])
  end
end
