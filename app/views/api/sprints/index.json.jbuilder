json.sprints @sprints, partial: 'sprint', as: :sprint
json.total_pages @sprints.total_pages if params[:page]
