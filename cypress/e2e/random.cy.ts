import MouseParallax from '../../src';

describe('Every possible combination (remember to check the "Free movement" test)', () => {

  beforeEach(() => {
    cy.visit('http://localhost:8080/random.html');
    // starting point
    cy.get('#parallax-object')
      .centerMouse();
  });

  /**
   * Manual test
   * WARNING: throttle change trigger reloadListeners without $document so the event isn't properly removed
   * So, only in this test, changing speed from fast to slow doesn't "work"
   */
  it('Free movement', () => {
    cy.get('#parallax-object')
      .then($element => {
        const mpInstance = new MouseParallax($element.children().toArray());
        cy.get("#custom-rule-element")
          .then($element =>
            mpInstance.addItem($element[0], {
              speed: 1000
            })
          )
        mpInstance.build();
        cy.document()
          .then($document => mpInstance.createListeners($document));
      });
  });
})
