# frozen_string_literal: true

# Controller which provides a way
# to carry out complex queries in an SQL-like syntax.
class API::SearchController < ::APIController
  # GET /api/search
  def search
    query = ::QueryAPI::Search.call(search_params)
    if query.valid?
      result = query.execute
      render json: result.as_json
    else
      render json: query.errors, status: :unprocessable_entity
    end
  rescue ::ActiveRecord::StatementInvalid => e
    render json: { query_failed: [e.message] }, status: :unprocessable_entity
  end

  private

  # Only allow a list of trusted parameters through.
  def search_params
    params.require(:search).permit!.to_h
  end
end
