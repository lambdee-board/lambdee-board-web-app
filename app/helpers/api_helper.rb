# frozen_string_literal: true

module APIHelper
  # @return [Symbol, nil]
  def include_association
    @include_association ||= params[:include].to_sym if include_association?
  end

  # @return [Boolean]
  def include_association?
    params[:include].present?
  end
end
