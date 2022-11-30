
describe('Workspace View', () => {
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
    cy.contains('Netflux').click()
  })

  context('BoardWorkView', () => {
    beforeEach(() => {
      cy.get('div.ListItem-board').first().click()
      cy.contains('Work View').click()
    })

    it('shows the board', () => {
      cy.get('.TaskLists-wrapper').should('exist')
      cy.contains('To do')
    })

    it('shows all list elements', () => {
      cy.get('.TaskList-wrapper').should('exist')
      cy.get('.TaskList-header-text').should('exist')
      cy.get('.TaskList-new-task-button p').should('exist')
    })
  })
  context('BoardPlanningView', () => {
    beforeEach(() => {
      cy.get('div.ListItem-board').first().click()
      cy.contains('Planning View').click()
    })

    it('shows the board', () => {
      cy.get('.TaskLists-wrapper').should('exist')
      cy.contains('To do')
    })

    it('shows all list elements', () => {
      cy.get('.TaskListPlanning-wrapper').should('exist')
      cy.get('.TaskListPlanning-header-text').should('exist')
      cy.get('.TaskListPlanning-new-task-button p').should('exist')
    })

    it('opens and closes (using mouse) "Create New List" button', () => {
      cy.get('.Toolbar').should('exist')
      cy.get('.Toolbar-create-list-button').first().click()
      cy.get('.Toolbar-new-list-input').should('exist')
      cy.get('.Toolbar-new-list-cancel').click()
      cy.get('.Toolbar-create-list-button').should('exist')
    })

    it('opens and closes (using esc button) "Create New List" button', () => {
      cy.get('.Toolbar').should('exist')
      cy.get('.Toolbar-create-list-button').first().click()
      cy.get('.Toolbar-new-list-input').should('exist')
      cy.get('body').type('{esc}')
      cy.get('.Toolbar-create-list-button').should('exist')
    })
    it('opens and closes (by clicking away) "Create New List" button', () => {
      cy.get('.Toolbar').should('exist')
      cy.get('.Toolbar-create-list-button').first().click()
      cy.get('.Toolbar-new-list-input').should('exist')
      cy.get('body').click(0, 0)
      cy.get('.Toolbar-create-list-button').should('exist')
    })

    it('creates new list named "Test List"', () => {
      cy.get('.Toolbar').should('exist')
      cy.get('.Toolbar-create-list-button').first().click()
      cy.get('.Toolbar-new-list-input').click()
        .type('Test List{enter}')
      cy.wait(500)
      cy.get('.TaskListPlanning-header-text').contains('Test List')
    })
  })
})
