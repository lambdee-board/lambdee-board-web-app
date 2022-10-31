
describe('WelcomeView', () => {
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
      .type('s3cr4t_p4ss')
    cy.contains('Login').click()
  })
  context('Recent', () => {
    it('does not show any recents', () => {
      cy.get('.RecentBoardButton').should('not.exist')
      cy.contains('Recents').should('not.exist')
    })

    it('adds a recent', () => {
      cy.get('div.MuiModal-root').should('not.exist')
      cy.contains('Workspaces').click()
      cy.get('div.MuiModal-root').should('exist')
      cy.get('div.MuiBackdrop-root').first().click()
      cy.get('.Workspace-menu-item').first().click()
      cy.get('div.Sidebar-wrapper').should('exist')
      cy.get('div.ListItem-board').first().click()
      cy.reload()
      cy.contains('Lambdee').click()
      cy.contains('Recent')
      cy.contains('Recents')
    })
    it('navigate to recent', () => {
      cy.get('div.MuiModal-root').should('not.exist')
      cy.contains('Workspaces').click()
      cy.get('div.MuiModal-root').should('exist')
      cy.get('div.MuiBackdrop-root').first().click()
      cy.get('.Workspace-menu-item').first().click()
      cy.get('div.Sidebar-wrapper').should('exist')
      cy.get('div.ListItem-board').first().click()
      cy.reload()
      cy.contains('Lambdee').click()
      cy.contains('Recent')
      cy.contains('Recents')
      cy.get('.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.MuiButton-fullWidth.MuiButtonBase-root.recentBoardButton.css-11miwwc-MuiButtonBase-root-MuiButton-root').should('exist').first()
        .click()
    })
    it('navigate to workspace', () => {
      cy.contains('Workspace')
      cy.get('.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.MuiButton-fullWidth.MuiButtonBase-root.workspaceButton.css-11miwwc-MuiButtonBase-root-MuiButton-root').should('exist').first()
        .click()
    })
  })
})
