# Seeds for initialising the production environment

workspace = ::DB::Workspace.create(name: 'Initial')

::DB::Board.create(
  name: 'Initial',
  colour: '#48F8D0',
  workspace: workspace
)

admin = ::DB::User.new(
  name: 'Admin',
  email: ::ENV['DEFAULT_ADMIN_USER_EMAIL'] || 'admin@example.com',
  password: ::ENV['DEFAULT_ADMIN_USER_PASSWORD'] || 'adminadmin',
  role: :admin
)
admin.save(validate: false)

workspace.users << admin
