# frozen_string_literal: true

# Module which contains constants with procs
# for soft deleting records in admin panel.
module TrestleExtensions::Archiver
  ENDPOINTS = proc do
    controller do
      def deactivate
        entity = admin.find_instance(params)
        entity.deactivate!
        flash[:message] = "#{entity.class.to_s.gsub('DB::', '')} has been archived"
        redirect_to admin.path(:index)
      end

      def activate
        entity = admin.find_instance(params)
        entity.activate!
        flash[:message] = "#{entity.class.to_s.gsub('DB::', '')} has been restored"
        redirect_to admin.path(:index)
      end
    end

    routes do
      post :deactivate, on: :member
      post :activate, on: :member
    end
  end

  BUTTONS = proc do
    actions align: :center do |toolbar, entity|
      toolbar.link 'Archive', entity, action: :deactivate, method: :post, style: :danger if entity.visible?
      toolbar.link 'Restore', entity, action: :activate, method: :post, style: :success if entity.archived?
    end
  end
end
