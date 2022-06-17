# frozen_string_literal: true

# Module which contains constants with procs
# for soft deleting records in admin panel.
module TrestleConcerns::Archiver
  ENDPOINTS = proc do
    remove_action :destroy

    controller do
      def deactivate
        entity = admin.find_instance(params)
        entity.archive!
        # rubocop:disable Style/IpAddresses
        flash[:message] = "#{entity.class.to_s.gsub('DB::', '')} has been archived"
        # rubocop:enable Style/IpAddresses
        redirect_to admin.path(:index)
      end

      def activate
        entity = admin.find_instance(params)
        entity.restore!
        # rubocop:disable Style/IpAddresses
        flash[:message] = "#{entity.class.to_s.gsub('DB::', '')} has been restored"
        # rubocop:enable Style/IpAddresses
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
