json.scripts @scripts, partial: 'script', as: :script
json.total_pages @scripts.total_pages if params[:page]
