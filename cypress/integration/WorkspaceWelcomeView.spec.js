
describe('WorkspaceWelcomeView', () => {
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
  })
  context('WorkspaceWelcomeView', () => {
    it('shows WorkspaceWelcomeView', () => {
      cy.contains('Netflux').click()
    })
    it('navigate to board from WorkspaceWelcomeView', () => {
      cy.contains('Netflux').click()
      cy.contains('Backend API').click()
      cy.contains('Planning View').click()
      cy.contains('Create New List')
      cy.contains('Doing')
      cy.contains('Change the ORM')
    })
    it('open TaskCardModal from WorkspaceWelcomeView', () => {
      cy.contains('Netflux').click()
      cy.contains('To do')
      cy.contains('Implement the User API').click()
      cy.contains('Description')
      cy.contains('Currently, there is no way')
    })
  })
})
