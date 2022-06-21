# Seeds for initialising the production environment

workspace = ::DB::Workspace.create(name: 'Initial')

::DB::Board.create(
  name: 'Initial',
  colour: '#48F8D0',
  workspace: workspace
)

admin = ::DB::User.create(
  name: 'Admin',
  email: 'admin@example.com',
  password: 'adminadmin',
  role: :admin
)

workspace.users << admin
