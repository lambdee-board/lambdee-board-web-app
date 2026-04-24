
describe('LoginView', () => {
  beforeEach(() => {
    cy.request('/cypress_rails_reset_state')
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('/login')
  })
  context('Login', () => {
    it('logs into account', () => {
      cy.contains('Lambdee')
      cy.get('#login-email').type('b-spinka@example.com')
      cy.get('input[type="password"]').type('password')
      cy.contains('Login').click()
    })

    // it('displays error message', () => {
    //   cy.get('#login-email').type('email')
    //   cy.get('input[type="password"]').type('password')
    //   cy.contains('Login').click()
    //   cy.contains('Incorrect credentials!')
    // })
    // it('resets password', () => {
    //   cy.contains('Forgot password?').click()
    //   cy.contains('Reset Password').click()
    //   cy.contains('Back to login').click()
    // })
    it('logs out of account', () => {
      cy.get('#login-email').type('b-spinka@example.com')
      cy.get('input[type="password"]').type('password')
      cy.contains('Login').click()
      cy.get('div.MuiModal-root').should('not.exist')
      cy.get('button.IconButton-user-avatar').click()
      cy.get('div.MuiModal-root').should('exist')
      cy.get('div.MuiBackdrop-root').first().click()
      cy.contains('Logout').click()
    })
    it('resets password from account view', () => {
      cy.get('#login-email').type('b-spinka@example.com')
      cy.get('input[type="password"]').type('password')
      cy.contains('Login').click()
      cy.get('div.MuiModal-root').should('not.exist')
      cy.get('button.IconButton-user-avatar').click()
      cy.get('div.MuiModal-root').should('exist')
      cy.get('div.MuiBackdrop-root').first().click()
      cy.contains('Account').click()
      cy.contains('Reset Password').click()
    })
  })
})
