
describe('TasksView', () => {
  beforeEach(() => {
    // reset the database!
    cy.request('/cypress_rails_reset_state')

    cy.visit('/tasks')
    // uncomment after merging to account for LoginView
    // cy.contains('Login').click()
  })
  context('TasksView', () => {
    it('shows TasksView', () => {
      cy.contains('Tasks').click()
      cy.get('.MuiDivider-root.MuiDivider-fullWidth.css-9mgopn-MuiDivider-root')
    })

    it('opens Workspace in TasksView', () => {
      cy.contains('Tasks').click()
      cy.get('.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.MuiButtonBase-root.css-1qf8hqa-MuiButtonBase-root-MuiButton-root').first().click()
      cy.get('.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.MuiButtonBase-root.userTasks-card-title.css-1qf8hqa-MuiButtonBase-root-MuiButton-root').first().click()
    })
    it('navigate to board from TasksView', () => {
      cy.contains('Tasks').click()
      cy.get('.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.MuiButtonBase-root.css-1qf8hqa-MuiButtonBase-root-MuiButton-root').first().click()
      cy.get('.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation1.MuiCard-root.userTasks-card.css-bhp9pd-MuiPaper-root-MuiCard-root')
    })
    it('open TaskCardModal from TasksView', () => {
      cy.contains('Tasks').click()
      cy.get('.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.MuiButtonBase-root.css-1qf8hqa-MuiButtonBase-root-MuiButton-root').first().click()
      cy.get('.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.MuiButtonBase-root.userTasks-card-list-task.css-1qf8hqa-MuiButtonBase-root-MuiButton-root').first().click()
      cy.get('.TaskLabel')
    })
  })
})
