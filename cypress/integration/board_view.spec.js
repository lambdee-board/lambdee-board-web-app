
describe('Board View', () => {
  beforeEach(() => {
    cy.visit('/', { failOnStatusCode: false })
  })

  context('Navbar', () => {
    it('displays the navbar with the logo', () => {
      cy.get('header h6').first().should('have.text', 'Lambdee')
    })

    it('can interact with dropdown buttons', () => {
      // Workspaces
      cy.get('div.MuiModal-root').should('not.exist')
      cy.contains('Workspaces').click()
      cy.get('div.MuiModal-root').should('exist')
      cy.get('div.MuiBackdrop-root').first().click()

      // Recent
      cy.get('div.MuiModal-root').should('not.exist')
      cy.contains('Recent').click()
      cy.get('div.MuiModal-root').should('exist')
      cy.get('div.MuiBackdrop-root').first().click()

      // Actions
      cy.get('div.MuiModal-root').should('not.exist')
      cy.contains('Actions').click()
      cy.get('div.MuiModal-root').should('exist')
      cy.get('div.MuiBackdrop-root').first().click()

      // My account avatar
      cy.get('div.MuiModal-root').should('not.exist')
      cy.get('button.IconButton-user-avatar').click()
      cy.get('div.MuiModal-root').should('exist')
      cy.get('div.MuiBackdrop-root').first().click()
    })
  })

  context('Sidebar', () => {
    it('displays the sidebar', () => {
      cy.get('div.Sidebar-wrapper').should('exist')
      cy.contains('SnippetzDev')
      cy.contains('Settings')
      cy.contains('Members')
      cy.contains('Board 1')
      cy.contains('Board 2')
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
})
