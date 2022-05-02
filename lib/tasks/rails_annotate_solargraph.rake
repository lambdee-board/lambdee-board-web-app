# frozen_string_literal: true

if ::Rails.env.development?
  namespace :annotate do
    namespace :solargraph do
      desc "Add YARD comments documenting the models' schemas"
      task generate: :environment do
        ::Rails::Annotate::Solargraph.generate
      end

      desc "Remove YARD comments documenting the models' schemas"
      task remove: :environment do
        ::Rails::Annotate::Solargraph.remove
      end
    end

    migration_tasks = %w[db:migrate db:migrate:up db:migrate:down db:migrate:reset db:migrate:redo db:rollback]
    migration_tasks.each do |task|
      next unless ::Rake::Task.task_defined?(task)

      ::Rake::Task[task].enhance do
        system 'yard gems' unless ENV['TEST']
        ::Rake::Task['annotate:solargraph:generate'].invoke
      end
    end
  end
end
