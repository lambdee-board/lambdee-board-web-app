
describe('Workspace View', () => {
  beforeEach(() => {
    // reset the database!
    cy.request('/cypress_rails_reset_state')

    cy.visit('/')
    cy.contains('Workspaces').click()
    cy.get('.Workspace-menu-item').first().click()
    cy.get('body').first().click()
  })

  // context('Sidebar', () => {
  //   it('displays the sidebar', () => {
  //     cy.get('div.Sidebar-wrapper').should('exist')
  //     cy.contains('Settings')
  //     cy.contains('Members')
  //     cy.get('div.ListItem-board').should('exist')
  //   })

  //   it('collapses and expands', () => {
  //     cy.get('div.Sidebar-wrapper .List-wrapper').should('be.visible')
  //     // Click on the Sidebar collapse button
  //     cy.get('div.Sidebar-wrapper .toggle-button').click()
  //     cy.get('div.Sidebar-wrapper .List-wrapper').should('not.be.visible')

  //     cy.get('div.Sidebar-wrapper .toggle-button').click()
  //     cy.get('div.Sidebar-wrapper .List-wrapper').should('be.visible')
  //   })
  // })

  context('Board', () => {
    beforeEach(() => {
      cy.get('div.ListItem-board').first().click()
    })

    it('shows the board', () => {
      cy.get('.TaskLists-wrapper').should('exist')
      cy.contains('Backlog')
    })

    it('shows all list elements', () => {
      cy.get('.TaskList-wrapper').should('exist')
      cy.get('.TaskList-header-text').should('exist')
      cy.get('.TaskList-new-task-button p').should('exist')
    })

    it('opens and closes (using mouse) "Create New List" button', () => {
      cy.get('.Toolbar').should('exist')
      cy.get('.Toolbar-create-list-button').click()
      cy.get('.Toolbar-new-list-input').should('exist')
      cy.get('.Toolbar-new-list-cancel').click()
      cy.get('.Toolbar-create-list-button').should('exist')
    })

    it('opens and closes (using esc button) "Create New List" button', () => {
      cy.get('.Toolbar').should('exist')
      cy.get('.Toolbar-create-list-button').click()
      cy.get('.Toolbar-new-list-input').should('exist')
      cy.get('body').type('{esc}')
      cy.get('.Toolbar-create-list-button').should('exist')
    })
    it('opens and closes (by clicking away) "Create New List" button', () => {
      cy.get('.Toolbar').should('exist')
      cy.get('.Toolbar-create-list-button').click()
      cy.get('.Toolbar-new-list-input').should('exist')
      cy.get('body').click(0, 0)
      cy.get('.Toolbar-create-list-button').should('exist')
    })

    it('creates new list named "Test List"', () => {
      cy.get('.Toolbar').should('exist')
      cy.get('.Toolbar-create-list-button').click()
      cy.get('.Toolbar-new-list-input').click()
        .type('Test List{enter}')
      cy.wait(500)
      cy.get('.TaskList-header-text').contains('Test List')
    })
  })
})
