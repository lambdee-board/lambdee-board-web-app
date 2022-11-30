
describe('TasksView', () => {
  beforeEach(() => {
    // reset the database!
    cy.request('/cypress_rails_reset_state')
    // clear cookies!
    cy.clearCookies()
    // clear localStorage
    cy.clearLocalStorage()
    cy.visit('/login')
    cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input').first()
      .type('b-spinka@example.com')
    cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input').eq(1)
      .type('password')
    cy.contains('Login').click()
    cy.visit('/tasks')
  })
  context('TasksView', () => {
    it('shows TasksView', () => {
      cy.contains('Tasks').click()
      cy.get('.MuiDivider-root.MuiDivider-fullWidth.css-9mgopn-MuiDivider-root')
    })

    it('opens Workspace in TasksView', () => {
      cy.contains('Tasks').click()
      cy.contains('Netflux').click()
      cy.contains('To do')
      cy.contains('Implement the User API')
    })
    it('navigate to board from TasksView', () => {
      cy.contains('Tasks').click()
      cy.contains('Netflux').click()
      cy.get('.userTasks-card-title > .MuiTypography-root').first().contains('Backend API')
        .click()
      cy.contains('Planning View').click()
      cy.contains('Create New List')
      cy.contains('Doing')
      cy.contains('Change the ORM')
    })
    it('open TaskCardModal from TasksView', () => {
      cy.contains('Tasks').click()
      cy.contains('Netflux').click()
      cy.contains('To do')
      cy.contains('Implement the User API').click()
      cy.contains('Description')
      cy.contains('Currently, there is no way')
    })
  })
})
