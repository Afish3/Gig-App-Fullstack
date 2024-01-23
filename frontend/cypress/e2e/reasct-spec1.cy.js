describe('template spec', () => {
  it('should be able to login as a user and update profile', () => {
    cy.visit('http://localhost:3000');

    cy.viewport('macbook-13')
    cy.get('#user-btn').click();

    cy.get('.Homepage').should('be.visible');
    cy.get('#email-login-btn').click();

    cy.get('.Login').should('be.visible');
    cy.get('#username').type('test2user');
    cy.get('#password').type('test2user');
    cy.get('#login-btn').click();

    cy.get('.Homepage').should('be.visible');
    cy.get('#welcome-lead').should('have.text', 'Welcome Back, test2!');

    // cy.get('#profile-btn').click({ force: true });

    // cy.get('.Profile').should('be.visible');
  })
})