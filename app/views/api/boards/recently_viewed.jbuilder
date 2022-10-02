# frozen_string_literal: true

json.array! @boards, partial: 'recently_viewed_board', as: :board
