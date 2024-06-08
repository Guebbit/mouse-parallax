/**
 * Insert here all custom commands that will often be reused
 * Remember to update index.d.ts
 */

/**
 * Login example
 */
// @ts-expect-error TODO resolve cypress Chainable error
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[name=email]').type(email);
  cy.get('input[name=password]').type(password);
  cy.get('button[type=submit]').click();
});
