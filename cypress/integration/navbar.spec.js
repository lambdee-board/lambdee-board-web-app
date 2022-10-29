describe('Navbar', () => {
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

  it('displays the navbar with the logo', () => {
    cy.get('header h6').first().should('have.text', 'Lambdee')
  })

  it('can interact with dropdown buttons', () => {
    // Workspaces
    cy.get('div.MuiModal-root').should('not.exist')
    cy.contains('Workspaces').click()
    cy.get('div.MuiModal-root').should('exist')
    cy.get('div.MuiBackdrop-root').first().click()

    // My account avatar
    cy.get('div.MuiModal-root').should('not.exist')
    cy.get('button.IconButton-user-avatar').click()
    cy.get('div.MuiModal-root').should('exist')
    cy.get('div.MuiBackdrop-root').first().click()
  })
  it('does not show Recent', () => {
    cy.get('div.MuiModal-root').should('not.exist')
    cy.contains('Recent').should('not.exist')
  })
  it('show Recent after adding a recent', () => {
    cy.get('div.MuiModal-root').should('not.exist')
    cy.contains('Workspaces').click()
    cy.get('div.MuiModal-root').should('exist')
    cy.get('div.MuiBackdrop-root').first().click()
    cy.get('.Workspace-menu-item').first().click()
    cy.get('div.Sidebar-wrapper').should('exist')
    cy.get('div.ListItem-board').first().click()
    cy.reload()
    cy.contains('Lambdee').click()
    cy.reload()
    cy.contains('Recent')
    cy.contains('Recents')
  })
  it('navigate to Recent', () => {
    cy.get('div.MuiModal-root').should('not.exist')
    cy.contains('Workspaces').click()
    cy.get('div.MuiModal-root').should('exist')
    cy.get('div.MuiBackdrop-root').first().click()
    cy.get('.Workspace-menu-item').first().click()
    cy.get('div.Sidebar-wrapper').should('exist')
    cy.get('div.ListItem-board').first().click()
    cy.reload()
    cy.contains('Lambdee').click()
    cy.reload()
    cy.contains('Recents')
    cy.contains('Recent').click()
    cy.get('.MuiMenuItem-root.MuiMenuItem-gutters.MuiButtonBase-root.css-fkgbok-MuiButtonBase-root-MuiMenuItem-root').first().click()
  })
})
