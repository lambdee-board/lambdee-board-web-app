# frozen_string_literal: true

class WorkspacesController < ApplicationController
  before_action :set_workspace

  def index
    render json: ::DB::Workspace.all
  end

  def show
    render json: @workspace
  end

  private

  def set_workspace
    @workspace = ::DB::Workspace.find(params[:id])
  end
end
