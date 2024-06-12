import mouseParallax from '../../src/index';

// TODO ENABLE\DISABLE mouse parallax && put fixed value instead of mouse (for animations), maybe for some seconds
describe('Test mouseParallax (visual test only)', () => {

  it('Shot effects', () => {
    cy.visit('http://localhost:8080/shoteffect.html');
    cy.document()
      .then($document => {
        cy.get('#parallax-object')
          .then($element => {
            mouseParallax($element.children().toArray(), $element[0], $document)?.build(false, 200);
          });
      });
  });
})
