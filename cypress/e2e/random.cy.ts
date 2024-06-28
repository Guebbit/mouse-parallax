import mouseParallax, { executeMouseParallax } from '../../src/old';

describe('Every possible combination (remember to check the "Free movement" test)', () => {

  beforeEach(() => {
    cy.visit('http://localhost:8080/random.html');
    // starting point
    cy.get('#parallax-object')
      .centerMouse();
  });

  it('Custom use (old)', () => {
    cy.document()
      .then($document => {
        cy.get('#parallax-object > *')
          .then($elements => {
            const parallaxObject = mouseParallax($elements.toArray(), null, $document);
            // single movement, like if the mouse were on 800x and 400y coordinates
            if(!parallaxObject)
              return;
            executeMouseParallax(parallaxObject, 800, 400)
            //after 1 second, another movement
            setTimeout(() => executeMouseParallax(parallaxObject, 1200, 800), 2000)
            // write the instructions for better view
            cy.get('#instructions').then($el => $el.html(JSON.stringify(parallaxObject, null, 2)))
          });
      });
  });

  it('Random Objects (old)', () => {
    cy.document()
      .then($document => {
        cy.get('#parallax-object > *')
          .then($elements => {
            const parallaxObject = mouseParallax($elements.toArray(), null, $document);
            if(!parallaxObject)
              return;
            parallaxObject.build();
            const { items = [] } = parallaxObject;
            // stop "low" text to move on Y axis
            items[2].intensityY = 0;
          });
      });
  });

  /**
   * Manual test
   */
  it('Free movement', () => {
    cy.document()
      .then($document =>
        cy.get('#parallax-object')
          .then($element => {
            mouseParallax($element.children().toArray(), $element[0], $document)
              ?.build(200);
          })
      );
  });
})
