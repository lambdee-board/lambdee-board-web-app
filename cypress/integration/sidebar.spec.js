describe('Sidebar', () => {
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
    cy.contains('Workspaces').click()
    cy.contains('Netflux').click({ force: true })
    cy.get('body').first().click()
  })
  // tests for displaying sidebar properly should be performed before this
  context('Add new Board', () => {
    it('switches between add board button and add board input field', () => {
      cy.get('.New-board-button').should('exist')
        .click()
      cy.get('.New-board').should('exist')
      cy.get('.New-board-cancel').should('exist').click()
      cy.get('.New-board-cancel').should('not.exist')
    })

    it('inputs string into add board input field and cancels', () => {
      cy.get('.New-board-button').should('exist')
        .click({ multiple: true })
      cy.get('.New-board textarea.MuiInputBase-input').should('exist').first()
        .click()
        .type('Cypress New Task')
      cy.get('body').type('{esc}')
      cy.get('.New-board-button').should('exist')
    })

    it('adds a new board', () => {
      cy.get('.New-board-button').should('exist')
        .click()
      cy.get('.New-board textarea.MuiInputBase-input').should('exist').first()
        .click()
        .type('New Board Board{enter}')
      cy.wait(500)
      cy.get('.Sidebar').contains('New Board Board')
    })
  })
})
