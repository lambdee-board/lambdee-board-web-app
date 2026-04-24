
describe('WelcomeView', () => {
  beforeEach(() => {
    // reset the database!
    cy.request('/cypress_rails_reset_state')
    // clear cookies!
    cy.clearCookies()
    // clear localStorage
    cy.clearLocalStorage()
    cy.login()
  })
  context('Recent', () => {
    it('does not show any recents', () => {
      cy.get('.RecentBoardButton').should('not.exist')
      cy.contains('Recents').should('not.exist')
    })

    it('adds a recent', () => {
      cy.get('div.MuiModal-root').should('not.exist')
      cy.contains('Netflux').click()
      cy.get('div.Sidebar-wrapper').should('exist')
      cy.get('div.ListItem-board').first().click()
      cy.reload()
      cy.contains('Lambdee').click()
      cy.contains('Recent')
      cy.contains('Recents')
    })
    it('navigate to recent', () => {
      cy.get('div.MuiModal-root').should('not.exist')
      cy.contains('Netflux').click()
      cy.get('div.Sidebar-wrapper').should('exist')
      cy.get('div.ListItem-board').first().click()
      cy.reload()
      cy.contains('Lambdee').click()
      cy.contains('Recent')
      cy.contains('Recents')
      cy.get('.recentBoardButton').first().click()
    })
    it('navigate to workspace', () => {
      cy.contains('Workspace')
      cy.get('.workspaceButton').first().click()
    })
  })
})
