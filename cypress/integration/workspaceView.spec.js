
describe('Workspace View', () => {
  beforeEach(() => {
    // reset the database!
    cy.request('/cypress_rails_reset_state')

    cy.visit('/')
    cy.contains('Workspaces').click()
    cy.get('.Workspace-menu-item').first().click()
    cy.get('body').first().click()
  })

  context('Sidebar', () => {
    it('displays the sidebar', () => {
      cy.get('div.Sidebar-wrapper').should('exist')
      cy.contains('Settings')
      cy.contains('Members')
      cy.get('div.ListItem-board').should('exist')
    })

    it('collapses and expands', () => {
      cy.get('div.Sidebar-wrapper .List-wrapper').should('be.visible')
      // Click on the Sidebar collapse button
      cy.get('div.Sidebar-wrapper .toggle-button').click()
      cy.get('div.Sidebar-wrapper .List-wrapper').should('not.be.visible')

      cy.get('div.Sidebar-wrapper .toggle-button').click()
      cy.get('div.Sidebar-wrapper .List-wrapper').should('be.visible')
    })
  })

  context('Board', () => {
    beforeEach(() => {
      cy.get('div.ListItem-board').first().click()
    })

    it('shows the board', () => {
      cy.get('.TaskLists-wrapper').should('exist')
      cy.contains('Backlog')
    })
  })
})
