import { mouseParallax, executeMouseParallax } from '../../src';

// ENABLE\DISABLE mouse parallax && put fixed value instead of mouse (for animations), maybe for some seconds

// TODO NOT visual test
describe('Test mouseParallax (visual test only)', () => {


  it('Custom use', () => {
    cy.visit('http://localhost:8000/mouseparallax-random.html');
    cy.document()
      .then($document => {
        cy.get('#parallax-object > *')
          .then($elements => {
            const parallaxObject = mouseParallax($elements.toArray(), null, $document);
            // single movement, like if the mouse were on 800x and 400y coordinates
            executeMouseParallax(parallaxObject, 800, 400)
            //after 1 second, another movement
            setTimeout(() => executeMouseParallax(parallaxObject, 1200, 800), 1000)
          });
      });
  });

  it('Shot effects', () => {
    cy.visit('http://localhost:8000/mouseparallax-shoteffect.html');
    cy.document()
      .then($document => {
        cy.get('#parallax-object')
          .then($element => {
            mouseParallax($element.children().toArray(), $element[0], $document)
              .build(false, 200);
          });
      });
  });

  it('Random Objects', () => {
    cy.visit('http://localhost:8000/mouseparallax-random.html');
    cy.document()
      .then($document => {
        cy.get('#parallax-object > *')
          .then($elements => {
            const parallaxObject = mouseParallax($elements.toArray(), null, $document);
            parallaxObject.build();
            const { items = [] } = parallaxObject;
            // stop "low" text to move on Y axis
            items[2].intensityY = 0;
          });
      });
  });

})
